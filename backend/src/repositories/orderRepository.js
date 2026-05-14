const db = require("../db");

function toNumber(value) {
  return Number(value ?? 0);
}

function mapOrder(row) {
  if (!row) return null;
  return {
    id: row.order_id,
    customer: row.customer,
    eventId: row.event_id,
    eventName: row.event_name,
    createdAt: row.order_date,
    status: row.payment_status,
    items: row.items ?? [],
    serviceFee: 0,
    discount: 0,
    total: toNumber(row.total_amount),
    promoCode: row.promo_code,
  };
}

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
  JOIN user_account ua ON ua.user_id = c.user_id
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

async function listOrders({ customerId } = {}) {
  const result = await db.query(
    `
      ${orderSelect}
      WHERE ($1::UUID IS NULL OR c.user_id = $1::UUID)
      ORDER BY o.order_date DESC
    `,
    [customerId ?? null]
  );

  return result.rows.map(mapOrder);
}

async function getOrderById(id) {
  const result = await db.query(
    `
      ${orderSelect}
      WHERE o.order_id = $1::UUID
      LIMIT 1
    `,
    [id]
  );

  return mapOrder(result.rows[0]);
}

async function updateOrderStatus(id, status) {
  const result = await db.query(
    `
      UPDATE "ORDER"
      SET payment_status = $2
      WHERE order_id = $1::UUID
      RETURNING order_id
    `,
    [id, status]
  );

  if (!result.rows[0]) return null;
  return getOrderById(id);
}

module.exports = {
  listOrders,
  getOrderById,
  updateOrderStatus,
  mapOrder,
};
