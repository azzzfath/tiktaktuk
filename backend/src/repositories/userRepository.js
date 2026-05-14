const db = require("../db");

function normalizeRole(roleName) {
  if (roleName === "administrator") return "admin";
  return roleName;
}

function toDatabaseRole(role) {
  if (role === "admin") return "administrator";
  return role;
}

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.user_id,
    username: row.username,
    role: normalizeRole(row.role_name),
    fullName: row.full_name ?? row.organizer_name ?? row.username,
    email: row.contact_email ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

async function createUser({ username, passwordHash, role, fullName, email }) {
  return db.withTransaction(async (client) => {
    const userResult = await client.query(
      `
        INSERT INTO user_account (username, password)
        VALUES ($1, $2)
        RETURNING user_id, username
      `,
      [username, passwordHash]
    );
    const user = userResult.rows[0];

    const roleResult = await client.query(
      `
        SELECT role_id, role_name
        FROM role
        WHERE role_name = $1
        LIMIT 1
      `,
      [toDatabaseRole(role)]
    );
    const dbRole = roleResult.rows[0];
    if (!dbRole) throw new Error(`Role ${role} belum tersedia di tabel role`);

    await client.query(
      `
        INSERT INTO account_role (role_id, user_id)
        VALUES ($1, $2)
      `,
      [dbRole.role_id, user.user_id]
    );

    let profile = {};
    if (role === "customer") {
      const customerResult = await client.query(
        `
          INSERT INTO customer (full_name, phone_number, user_id)
          VALUES ($1, NULL, $2)
          RETURNING full_name
        `,
        [fullName ?? username, user.user_id]
      );
      profile = customerResult.rows[0];
    }

    if (role === "organizer") {
      const organizerResult = await client.query(
        `
          INSERT INTO organizer (organizer_name, contact_email, user_id)
          VALUES ($1, $2, $3)
          RETURNING organizer_name, contact_email
        `,
        [fullName ?? username, email ?? null, user.user_id]
      );
      profile = organizerResult.rows[0];
    }

    return mapUser({ ...user, ...profile, role_name: dbRole.role_name });
  });
}

async function findUserByUsername(username) {
  const result = await db.query(
    `
      SELECT
        ua.user_id,
        ua.username,
        ua.password,
        r.role_name,
        c.full_name,
        o.organizer_name,
        o.contact_email
      FROM user_account ua
      JOIN account_role ar ON ar.user_id = ua.user_id
      JOIN role r ON r.role_id = ar.role_id
      LEFT JOIN customer c ON c.user_id = ua.user_id
      LEFT JOIN organizer o ON o.user_id = ua.user_id
      WHERE LOWER(ua.username) = LOWER($1)
      ORDER BY CASE r.role_name
        WHEN 'administrator' THEN 1
        WHEN 'organizer' THEN 2
        WHEN 'customer' THEN 3
        ELSE 4
      END
      LIMIT 1
    `,
    [username]
  );

  return result.rows[0] ?? null;
}

async function findUserWithPasswordByUsername(username) {
  return findUserByUsername(username);
}

async function findCustomerByUserId(userId, client = db) {
  const result = await client.query(
    `
      SELECT customer_id, full_name
      FROM customer
      WHERE user_id = $1
      LIMIT 1
    `,
    [userId]
  );

  return result.rows[0] ?? null;
}

module.exports = {
  createUser,
  findUserWithPasswordByUsername,
  findCustomerByUserId,
  mapUser,
  toDatabaseRole,
};
