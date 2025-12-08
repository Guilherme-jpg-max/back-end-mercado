const { query } = require("../config/database");

const Category = {
  findAll: async () => {
    const result = await query("SELECT * FROM categories ORDER BY name");
    return result.rows;
  },

  findById: async (id) => {
    const result = await query("SELECT * FROM categories WHERE id = $1", [id]);
    return result.rows[0];
  },

  findBySlug: async (slug) => {
    const result = await query("SELECT * FROM categories WHERE slug = $1", [
      slug,
    ]);
    return result.rows[0];
  },

  create: async (categoryData) => {
    const { name, slug } = categoryData;

    const result = await query(
      "INSERT INTO categories (name, slug, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [name, slug]
    );

    return result.rows[0];
  },

  update: async (id, categoryData) => {
    const { name, slug } = categoryData;

    const result = await query(
      "UPDATE categories SET name = COALESCE($1, name), slug = COALESCE($2, slug) WHERE id = $3 RETURNING *",
      [name, slug, id]
    );

    return result.rows[0];
  },

  delete: async (id) => {
    await query("DELETE FROM categories WHERE id = $1", [id]);
    return true;
  },
};

module.exports = Category;
