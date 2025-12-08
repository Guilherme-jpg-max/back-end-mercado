const { query } = require("../config/database");

const User = {
  create: async (userData) => {
    const { name, email, password, phone, role = "customer" } = userData;

    const result = await query(
      `INSERT INTO users (name, email, password, phone, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, name, email, phone, role, created_at`,
      [name, email, password, phone, role]
    );

    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await query(
      "SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  findByIdWithPassword: async (id) => {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  },

  update: async (id, userData) => {
    const { name, email, phone } = userData;

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, phone, role, created_at, updated_at`,
      [name, email, phone, id]
    );

    return result.rows[0];
  },

  updatePassword: async (id, hashedPassword) => {
    const result = await query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id",
      [hashedPassword, id]
    );

    return result.rows[0];
  },

  delete: async (id) => {
    await query("DELETE FROM users WHERE id = $1", [id]);
    return true;
  },

  findAll: async (limit = 50, offset = 0) => {
    const result = await query(
      `SELECT id, name, email, phone, role, created_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  },

  count: async () => {
    const result = await query("SELECT COUNT(*) as total FROM users");
    return parseInt(result.rows[0].total);
  },
};

module.exports = User;
