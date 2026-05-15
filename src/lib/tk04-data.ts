import type { PoolClient, QueryResultRow } from "pg";
import pool from "@/lib/supabase";
import type { Event, Order, Promotion, Venue, VenueFormValues } from "@/types";
import type { SessionUser } from "@/types/auth";
import type { PromotionFormValues } from "@/components/features/promotion/PromotionForm";

const orderSelect = `
  SELECT
    o.order_id,
    json_build_object(
      'id', c.customer_id,
      'name', c.full_name,
      'email', NULL
    ) AS customer,
    first_event.event_id,
    first_event.event_title AS event_name,
    o.order_date,
    o.payment_status,
    o.total_amount,
    first_promo.promo_code,
    COALESCE((
      SELECT json_agg(
        json_build_object(
          'categoryId', grouped.category_id,
          'categoryName', grouped.category_name,
          'quantity', grouped.quantity,
          'unitPrice', grouped.unit_price,
          'seatLabels', '[]'::JSON
        )
        ORDER BY grouped.category_name
      )
      FROM (
        SELECT
          tc.category_id,
          tc.category_name,
          COUNT(t.ticket_id)::INT AS quantity,
          tc.price AS unit_price
        FROM ticket t
        JOIN ticket_category tc ON tc.category_id = t.tcategory_id
        WHERE t.torder_id = o.order_id
        GROUP BY tc.category_id
      ) AS grouped
    ), '[]'::JSON) AS items
  FROM "ORDER" o
  JOIN customer c ON c.customer_id = o.customer_id
  LEFT JOIN LATERAL (
    SELECT e.event_id, e.event_title
    FROM ticket t
    JOIN ticket_category tc ON tc.category_id = t.tcategory_id
    JOIN event e ON e.event_id = tc.tevent_id
    WHERE t.torder_id = o.order_id
    ORDER BY t.ticket_code
    LIMIT 1
  ) AS first_event ON TRUE
  LEFT JOIN LATERAL (
    SELECT p.promo_code
    FROM order_promotion op
    JOIN promotion p ON p.promotion_id = op.promotion_id
    WHERE op.order_id = o.order_id
    ORDER BY p.promo_code
    LIMIT 1
  ) AS first_promo ON TRUE
`;

type Queryable = {
  query<T extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
};

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function listEvents(): Promise<Event[]> {
  const { rows } = await pool.query(`
    SELECT
      e.event_id,
      e.event_title,
      e.event_datetime::DATE::TEXT AS event_date,
      TO_CHAR(e.event_datetime, 'HH24:MI') AS event_time,
      COALESCE(v.venue_name, e.venue_id::TEXT) AS venue_id,
      COALESCE((
        SELECT json_agg(row_to_json(category_row) ORDER BY category_row.price DESC)
        FROM (
          SELECT
            tc.category_id AS id,
            tc.category_name AS name,
            tc.price,
            tc.quota,
            GREATEST(tc.quota - COUNT(t.ticket_id), 0)::INT AS remaining,
            tc.quota AS total
          FROM ticket_category tc
          LEFT JOIN ticket t ON t.tcategory_id = tc.category_id
          WHERE tc.tevent_id = e.event_id
          GROUP BY tc.category_id
        ) AS category_row
      ), '[]'::JSON) AS categories,
      COALESCE((
        SELECT json_agg(row_to_json(seat_row) ORDER BY seat_row.label)
        FROM (
          SELECT
            s.seat_id AS id,
            s.section || s.row_number || s.seat_number AS label,
            first_category.category_id AS "categoryId",
            TRUE AS available
          FROM seat s
          CROSS JOIN LATERAL (
            SELECT tc.category_id
            FROM ticket_category tc
            WHERE tc.tevent_id = e.event_id
            ORDER BY tc.price DESC
            LIMIT 1
          ) AS first_category
          WHERE s.venue_id = e.venue_id
        ) AS seat_row
      ), '[]'::JSON) AS seats
    FROM event e
    LEFT JOIN venue v ON v.venue_id = e.venue_id
    ORDER BY e.event_datetime ASC
  `);

  return rows.map((row) => ({
    event_id: row.event_id,
    event_title: row.event_title,
    event_date: row.event_date,
    event_time: row.event_time,
    venue_id: row.venue_id,
    artists: [],
    categories: row.categories ?? [],
    seats: row.seats ?? [],
  }));
}

export async function getEventById(id: string) {
  const events = await listEvents();
  return events.find((event) => event.event_id === id) ?? null;
}

export async function listOrdersForUser(user: SessionUser | null): Promise<Order[]> {
  const customerUserId = user?.role === "customer" ? user.userId : null;
  const { rows } = await pool.query(
    `
      ${orderSelect}
      WHERE ($1::UUID IS NULL OR c.user_id = $1::UUID)
      ORDER BY o.order_date DESC
    `,
    [customerUserId]
  );

  return rows.map(mapOrder);
}

export async function getOrderById(id: string, client: Queryable = pool) {
  const { rows } = await client.query(
    `
      ${orderSelect}
      WHERE o.order_id = $1::UUID
      LIMIT 1
    `,
    [id]
  );

  return rows[0] ? mapOrder(rows[0]) : null;
}

export async function createOrderForCustomer(
  user: SessionUser,
  payload: { categoryId?: string; quantity?: number; promoCode?: string; seatIds?: string[] }
) {
  const quantity = Number(payload.quantity);
  if (!payload.categoryId) throw new Error("Kategori tiket wajib diisi.");
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Jumlah tiket harus lebih dari 0.");
  }

  let createdOrderId = "";

  await withTransaction(async (client) => {
    const { rows: customerRows } = await client.query(
      "SELECT customer_id FROM customer WHERE user_id = $1::UUID LIMIT 1",
      [user.userId]
    );
    const customer = customerRows[0];
    if (!customer) throw new Error("Profil customer tidak ditemukan.");

    const { rows: categoryRows } = await client.query(
      `
        SELECT
          tc.category_id,
          tc.category_name,
          tc.price,
          tc.quota,
          COUNT(t.ticket_id)::INT AS sold
        FROM ticket_category tc
        LEFT JOIN ticket t ON t.tcategory_id = tc.category_id
        WHERE tc.category_id = $1::UUID
        GROUP BY tc.category_id
        FOR UPDATE OF tc
      `,
      [payload.categoryId]
    );
    const category = categoryRows[0];
    if (!category) throw new Error("Kategori tiket tidak ditemukan.");
    if (Number(category.quota) - Number(category.sold) < quantity) {
      throw new Error("Sisa tiket tidak mencukupi.");
    }

    const promotion = payload.promoCode
      ? await findPromotionByCode(payload.promoCode, client)
      : null;

    if (payload.promoCode && !promotion) {
      throw new Error("Kode promo tidak valid.");
    }

    const subtotal = Number(category.price) * quantity;
    const discount = computeDiscount(subtotal, promotion);
    const total = Math.max(0, subtotal - discount);

    const { rows: orderRows } = await client.query(
      `
        INSERT INTO "ORDER" (order_date, payment_status, total_amount, customer_id)
        VALUES (NOW(), 'PAID', $1, $2)
        RETURNING order_id
      `,
      [total, customer.customer_id]
    );
    createdOrderId = orderRows[0].order_id;

    const relationTableExists = await hasTable("has_relationship", client);
    const seatIds = payload.seatIds ?? [];

    for (let index = 0; index < quantity; index += 1) {
      const { rows: ticketRows } = await client.query(
        `
          INSERT INTO ticket (ticket_code, tcategory_id, torder_id)
          VALUES ($1, $2, $3)
          RETURNING ticket_id
        `,
        [
          `TCK-${String(createdOrderId).slice(0, 8).toUpperCase()}-${index + 1}`,
          category.category_id,
          createdOrderId,
        ]
      );

      const seatId = seatIds[index];
      if (relationTableExists && seatId) {
        await client.query(
          "INSERT INTO has_relationship (seat_id, ticket_id) VALUES ($1::UUID, $2::UUID)",
          [seatId, ticketRows[0].ticket_id]
        );
      }
    }

    if (promotion) {
      await client.query(
        "INSERT INTO order_promotion (promotion_id, order_id) VALUES ($1::UUID, $2::UUID)",
        [promotion.id, createdOrderId]
      );
    }
  });

  return getOrderById(createdOrderId);
}

export async function updateOrderStatus(id: string, status: string) {
  if (!["PAID", "PENDING", "CANCELLED"].includes(status)) {
    throw new Error("Status order tidak valid.");
  }

  await pool.query(
    'UPDATE "ORDER" SET payment_status = $2 WHERE order_id = $1::UUID',
    [id, status]
  );

  return getOrderById(id);
}

export async function deleteOrder(id: string) {
  const order = await getOrderById(id);
  if (!order) return null;

  await withTransaction(async (client) => {
    await client.query("DELETE FROM order_promotion WHERE order_id = $1::UUID", [id]);
    if (await hasTable("has_relationship", client)) {
      await client.query(
        `
          DELETE FROM has_relationship hr
          USING ticket t
          WHERE hr.ticket_id = t.ticket_id
            AND t.torder_id = $1::UUID
        `,
        [id]
      );
    }
    await client.query("DELETE FROM ticket WHERE torder_id = $1::UUID", [id]);
    await client.query('DELETE FROM "ORDER" WHERE order_id = $1::UUID', [id]);
  });

  return order;
}

export async function listPromotions(): Promise<Promotion[]> {
  const { rows } = await pool.query(`
    SELECT
      p.promotion_id,
      p.promo_code,
      p.discount_type,
      p.discount_value,
      p.start_date,
      p.end_date,
      p.usage_limit,
      COUNT(op.order_promotion_id)::INT AS usage_count
    FROM promotion p
    LEFT JOIN order_promotion op ON op.promotion_id = p.promotion_id
    GROUP BY p.promotion_id
    ORDER BY p.start_date DESC, p.promo_code ASC
  `);

  return rows.map(mapPromotion);
}

export async function findPromotionByCode(code: string, client: Queryable = pool) {
  const { rows } = await client.query(
    `
      SELECT
        p.promotion_id,
        p.promo_code,
        p.discount_type,
        p.discount_value,
        p.start_date,
        p.end_date,
        p.usage_limit,
        COUNT(op.order_promotion_id)::INT AS usage_count
      FROM promotion p
      LEFT JOIN order_promotion op ON op.promotion_id = p.promotion_id
      WHERE UPPER(p.promo_code) = UPPER($1)
      GROUP BY p.promotion_id
      LIMIT 1
    `,
    [code]
  );

  return rows[0] ? mapPromotion(rows[0]) : null;
}

export async function createPromotion(values: PromotionFormValues) {
  const { rows } = await pool.query(
    `
      INSERT INTO promotion
        (promo_code, discount_type, discount_value, start_date, end_date, usage_limit)
      VALUES (UPPER($1), $2, $3, $4, $5, $6)
      RETURNING
        promotion_id,
        promo_code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        usage_limit,
        0::INT AS usage_count
    `,
    [values.code, values.type, values.value, values.startDate, values.endDate, values.usageLimit]
  );

  return mapPromotion(rows[0]);
}

export async function updatePromotion(id: string, values: PromotionFormValues) {
  const { rows } = await pool.query(
    `
      UPDATE promotion
      SET
        promo_code = UPPER($2),
        discount_type = $3,
        discount_value = $4,
        start_date = $5,
        end_date = $6,
        usage_limit = $7
      WHERE promotion_id = $1::UUID
      RETURNING
        promotion_id,
        promo_code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        usage_limit,
        (
          SELECT COUNT(*)::INT
          FROM order_promotion op
          WHERE op.promotion_id = promotion.promotion_id
        ) AS usage_count
    `,
    [id, values.code, values.type, values.value, values.startDate, values.endDate, values.usageLimit]
  );

  return rows[0] ? mapPromotion(rows[0]) : null;
}

export async function deletePromotion(id: string) {
  const { rows } = await pool.query(
    `
      DELETE FROM promotion
      WHERE promotion_id = $1::UUID
      RETURNING
        promotion_id,
        promo_code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        usage_limit,
        0::INT AS usage_count
    `,
    [id]
  );

  return rows[0] ? mapPromotion(rows[0]) : null;
}

export async function listVenues(): Promise<Venue[]> {
  const { rows } = await pool.query(`
    SELECT venue_id, venue_name, capacity, address, city
    FROM venue
    ORDER BY venue_name ASC
  `);

  return rows.map(mapVenue);
}

export async function createVenue(values: VenueFormValues) {
  const { rows } = await pool.query(
    `
      INSERT INTO venue (venue_name, capacity, address, city)
      VALUES ($1, $2, $3, $4)
      RETURNING venue_id, venue_name, capacity, address, city
    `,
    [values.venue_name, values.capacity, values.address, values.city]
  );

  return mapVenue(rows[0]);
}

export async function updateVenue(id: string, values: VenueFormValues) {
  const { rows } = await pool.query(
    `
      UPDATE venue
      SET venue_name = $2, capacity = $3, address = $4, city = $5
      WHERE venue_id = $1::UUID
      RETURNING venue_id, venue_name, capacity, address, city
    `,
    [id, values.venue_name, values.capacity, values.address, values.city]
  );

  return rows[0] ? mapVenue(rows[0]) : null;
}

export async function deleteVenue(id: string) {
  const { rows } = await pool.query(
    `
      DELETE FROM venue
      WHERE venue_id = $1::UUID
      RETURNING venue_id, venue_name, capacity, address, city
    `,
    [id]
  );

  return rows[0] ? mapVenue(rows[0]) : null;
}

function mapOrder(row: QueryResultRow): Order {
  return {
    id: row.order_id,
    customer: row.customer,
    eventId: row.event_id,
    eventName: row.event_name ?? "-",
    createdAt: row.order_date,
    status: row.payment_status,
    items: row.items ?? [],
    serviceFee: 0,
    discount: 0,
    total: Number(row.total_amount ?? 0),
    promoCode: row.promo_code ?? undefined,
  };
}

function mapPromotion(row: QueryResultRow): Promotion {
  return {
    id: row.promotion_id,
    code: row.promo_code,
    type: row.discount_type,
    value: Number(row.discount_value),
    startDate: toDateString(row.start_date),
    endDate: toDateString(row.end_date),
    usageLimit: Number(row.usage_limit),
    usageCount: Number(row.usage_count ?? 0),
  };
}

function mapVenue(row: QueryResultRow): Venue {
  return {
    venue_id: row.venue_id,
    venue_name: row.venue_name,
    capacity: Number(row.capacity),
    address: row.address,
    city: row.city,
    hasReservedSeating: false,
  };
}

function computeDiscount(subtotal: number, promotion: Promotion | null) {
  if (!promotion) return 0;
  if (promotion.type === "PERCENTAGE") return Math.floor((subtotal * promotion.value) / 100);
  return Math.min(subtotal, promotion.value);
}

async function hasTable(tableName: string, client: Queryable) {
  const { rows } = await client.query("SELECT to_regclass($1) AS table_name", [`public.${tableName}`]);
  return Boolean(rows[0]?.table_name);
}

function toDateString(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}
