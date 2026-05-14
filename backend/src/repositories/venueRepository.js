const db = require("../db");

function mapVenue(row) {
  if (!row) return null;
  return {
    venue_id: row.venue_id,
    venue_name: row.venue_name,
    capacity: Number(row.capacity),
    address: row.address,
    city: row.city,
    hasReservedSeating: false,
  };
}

async function listVenues() {
  const result = await db.query(
    `
      SELECT venue_id, venue_name, capacity, address, city, has_reserved_seating
      FROM (
        SELECT venue_id, venue_name, capacity, address, city, FALSE AS has_reserved_seating
        FROM venue
      ) AS venues
      ORDER BY venue_name ASC
    `
  );

  return result.rows.map(mapVenue);
}

async function createVenue(values) {
  const result = await db.query(
    `
      INSERT INTO venue
        (venue_name, capacity, address, city)
      VALUES
        ($1, $2, $3, $4)
      RETURNING venue_id, venue_name, capacity, address, city, FALSE AS has_reserved_seating
    `,
    [
      values.venue_name,
      values.capacity,
      values.address,
      values.city,
    ]
  );

  return mapVenue(result.rows[0]);
}

async function updateVenue(id, values) {
  const result = await db.query(
    `
      UPDATE venue
      SET
        venue_name = $2,
        capacity = $3,
        address = $4,
        city = $5
      WHERE venue_id = $1::UUID
      RETURNING venue_id, venue_name, capacity, address, city, FALSE AS has_reserved_seating
    `,
    [
      id,
      values.venue_name,
      values.capacity,
      values.address,
      values.city,
    ]
  );

  return mapVenue(result.rows[0]);
}

async function deleteVenue(id) {
  const result = await db.query(
    `
      DELETE FROM venue
      WHERE venue_id = $1::UUID
      RETURNING venue_id, venue_name, capacity, address, city, FALSE AS has_reserved_seating
    `,
    [id]
  );

  return mapVenue(result.rows[0]);
}

module.exports = {
  listVenues,
  createVenue,
  updateVenue,
  deleteVenue,
};
