const db = require("../db");
const orderRepository = require("../repositories/orderRepository");
const userRepository = require("../repositories/userRepository");
const { createHttpError } = require("../utils/httpError");

const allowedStatuses = new Set(["PAID", "PENDING", "CANCELLED"]);

function computeDiscount(subtotal, promotion) {
  if (!promotion) return 0;
  if (promotion.discount_type === "PERCENTAGE") {
    return Math.floor((subtotal * Number(promotion.discount_value)) / 100);
  }
  return Math.min(subtotal, Number(promotion.discount_value));
}

async function listOrdersForUser(user) {
  const customerId = user?.role === "customer" ? user.id : null;
  return orderRepository.listOrders({ customerId });
}

async function createOrder(user, payload) {
  if (!user) throw createHttpError(401, "Login diperlukan");
  if (user.role !== "customer") {
    throw createHttpError(403, "Hanya customer yang dapat membuat order");
  }
  const quantity = Number(payload.quantity);
  if (!payload.categoryId) throw createHttpError(400, "Kategori tiket wajib diisi");
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw createHttpError(400, "Jumlah tiket harus lebih dari 0");
  }

  let orderId;
  await db.withTransaction(async (client) => {
    const customer = await userRepository.findCustomerByUserId(user.id, client);
    if (!customer) throw createHttpError(403, "Profil customer tidak ditemukan");

    const categoryResult = await client.query(
      `
        SELECT
          tc.category_id,
          tc.category_name,
          tc.price,
          tc.quota,
          (
            SELECT COUNT(*)::INT
            FROM ticket t
            WHERE t.tcategory_id = tc.category_id
          ) AS sold
        FROM ticket_category tc
        WHERE tc.category_id = $1::UUID
        FOR UPDATE
      `,
      [payload.categoryId]
    );
    const category = categoryResult.rows[0];
    if (!category) throw createHttpError(404, "Kategori tiket tidak ditemukan");
    if (Number(category.quota) - Number(category.sold) < quantity) {
      throw createHttpError(400, "Sisa tiket tidak mencukupi");
    }

    let promotion = null;
    if (payload.promotionId) {
      const promoResult = await client.query(
        `
          SELECT
            promotion_id,
            promo_code,
            discount_type,
            discount_value
          FROM promotion
          WHERE promotion_id = $1::UUID
          FOR UPDATE
        `,
        [payload.promotionId]
      );
      promotion = promoResult.rows[0] ?? null;
      if (!promotion) {
        throw createHttpError(400, `Promotion dengan ID ${payload.promotionId} tidak ditemukan.`);
      }
    } else if (payload.promoCode) {
      const promoResult = await client.query(
        `
          SELECT
            promotion_id,
            promo_code,
            discount_type,
            discount_value
          FROM promotion
          WHERE UPPER(promo_code) = UPPER($1)
          FOR UPDATE
        `,
        [payload.promoCode]
      );
      promotion = promoResult.rows[0] ?? null;
      if (!promotion) throw createHttpError(400, "Kode promo tidak valid");
    }

    const subtotal = Number(category.price) * quantity;
    const discount = computeDiscount(subtotal, promotion);
    const total = Math.max(0, subtotal - discount);

    const orderResult = await client.query(
      `
        INSERT INTO "ORDER"
          (order_date, payment_status, total_amount, customer_id)
        VALUES
          (NOW(), 'PAID', $1, $2)
        RETURNING order_id
      `,
      [total, customer.customer_id]
    );
    orderId = orderResult.rows[0].order_id;

    for (let index = 0; index < quantity; index += 1) {
      await client.query(
        `
          INSERT INTO ticket (ticket_code, tcategory_id, torder_id)
          VALUES ($1, $2, $3)
        `,
        [`TCK-${String(orderId).slice(0, 8).toUpperCase()}-${index + 1}`, category.category_id, orderId]
      );
    }

    if (promotion) {
      await client.query(
        `
          INSERT INTO order_promotion (promotion_id, order_id)
          VALUES ($1, $2)
        `,
        [promotion.promotion_id, orderId]
      );
    }
  });

  return orderRepository.getOrderById(orderId);
}

async function updateStatus(id, status) {
  if (!allowedStatuses.has(status)) throw createHttpError(400, "Status order tidak valid");
  const order = await orderRepository.updateOrderStatus(id, status);
  if (!order) throw createHttpError(404, "Order tidak ditemukan");
  return order;
}

async function deleteOrder(id) {
  const order = await orderRepository.getOrderById(id);
  if (!order) throw createHttpError(404, "Order tidak ditemukan");

  await db.withTransaction(async (client) => {
    await client.query(
      "DELETE FROM order_promotion WHERE order_id = $1::UUID",
      [id]
    );
    await client.query(
      "DELETE FROM ticket WHERE torder_id = $1::UUID",
      [id]
    );
    await client.query("DELETE FROM \"ORDER\" WHERE order_id = $1::UUID", [id]);
  });

  return order;
}

module.exports = {
  listOrdersForUser,
  createOrder,
  updateStatus,
  deleteOrder,
};
