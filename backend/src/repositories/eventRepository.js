const db = require("../db");

function toNumber(value) {
  return Number(value ?? 0);
}

function mapEvent(row) {
  if (!row) return null;
  return {
    id: row.event_id,
    name: row.event_title,
    date: row.event_datetime,
    venue: row.venue,
    bannerUrl: null,
    categories: (row.categories ?? []).map((category) => ({
      id: category.id,
      name: category.name,
      price: toNumber(category.price),
      remaining: Number(category.remaining),
      total: Number(category.total),
    })),
    seats: row.seats ?? [],
  };
}

async function listEvents() {
  const result = await db.query(
    `
      SELECT
        e.event_id,
        e.event_title,
        e.event_datetime::TEXT,
        v.venue_name AS venue,
        COALESCE((
          SELECT json_agg(row_to_json(category_row) ORDER BY category_row.price DESC)
          FROM (
            SELECT
              tc.category_id AS id,
              tc.category_name AS name,
              tc.price,
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
              s.section || '-' || s.row_number || s.seat_number AS label,
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
    `
  );

  return result.rows.map(mapEvent);
}

async function getEventById(id) {
  const result = await db.query(
    `
      SELECT
        e.event_id,
        e.event_title,
        e.event_datetime::TEXT,
        v.venue_name AS venue,
        COALESCE((
          SELECT json_agg(row_to_json(category_row) ORDER BY category_row.price DESC)
          FROM (
            SELECT
              tc.category_id AS id,
              tc.category_name AS name,
              tc.price,
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
              s.section || '-' || s.row_number || s.seat_number AS label,
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
      WHERE e.event_id = $1::UUID
      LIMIT 1
    `,
    [id]
  );

  return mapEvent(result.rows[0]);
}

module.exports = {
  listEvents,
  getEventById,
};
