const db = require("../db");

function toDateString(value) {
  if (!value) return value;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function mapPromotion(row) {
  if (!row) return null;
  return {
    id: row.promotion_id,
    code: row.promo_code,
    type: row.discount_type,
    value: Number(row.discount_value),
    startDate: toDateString(row.start_date),
    endDate: toDateString(row.end_date),
    usageLimit: Number(row.usage_limit),
    usageCount: Number(row.usage_count),
  };
}

async function listPromotions() {
  const result = await db.query(
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
      GROUP BY p.promotion_id
      ORDER BY p.start_date DESC, p.promo_code ASC
    `
  );

  return result.rows.map(mapPromotion);
}

async function findPromotionByCode(code, client = db, onlyActive = false) {
  const result = await client.query(
    `
      SELECT
        promotion_id,
        promo_code,
        discount_type,
        discount_value,
        start_date,
        end_date,
        usage_limit,
        usage_count,
        code,
        type,
        value
      FROM (
        SELECT
          p.promotion_id AS id,
          p.promotion_id,
          p.promo_code AS code,
          p.promo_code,
          p.discount_type AS type,
          p.discount_type,
          p.discount_value AS value,
          p.discount_value,
          p.start_date,
          p.end_date,
          p.usage_limit,
          COUNT(op.order_promotion_id)::INT AS usage_count
        FROM promotion p
        LEFT JOIN order_promotion op ON op.promotion_id = p.promotion_id
        WHERE UPPER(p.promo_code) = UPPER($1)
        GROUP BY p.promotion_id
      ) AS promo
      WHERE TRUE
        AND ($2::BOOLEAN = FALSE OR (
          CURRENT_DATE BETWEEN start_date AND end_date
          AND usage_count < usage_limit
        ))
      LIMIT 1
    `,
    [code, onlyActive]
  );

  return result.rows[0] ?? null;
}

async function createPromotion(values, userId) {
  const result = await db.query(
    `
      INSERT INTO promotion
        (promo_code, discount_type, discount_value, start_date, end_date, usage_limit)
      VALUES
        (UPPER($1), $2, $3, $4, $5, $6)
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
    [
      values.code,
      values.type,
      values.value,
      values.startDate,
      values.endDate,
      values.usageLimit,
    ]
  );

  return mapPromotion(result.rows[0]);
}

async function updatePromotion(id, values) {
  const result = await db.query(
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

  return mapPromotion(result.rows[0]);
}

async function deletePromotion(id) {
  const result = await db.query(
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

  return mapPromotion(result.rows[0]);
}

module.exports = {
  listPromotions,
  findPromotionByCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
  mapPromotion,
};
