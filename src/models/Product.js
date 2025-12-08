const { query } = require("../config/database");

const Product = {
  calculateDiscount: (price, oldPrice) => {
    if (!oldPrice || oldPrice <= price) return null;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  },

  formatProduct: (product) => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      oldPrice: product.old_price ? parseFloat(product.old_price) : null,
      discount: Product.calculateDiscount(product.price, product.old_price),
      category: product.category,
      imageUrl: product.image_url,
      stock: product.stock,
      isActive: product.is_active,
      isFeatured: product.is_featured,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  },

  create: async (productData) => {
    const {
      name,
      description,
      price,
      oldPrice,
      category,
      imageUrl,
      stock,
      isFeatured = false,
    } = productData;

    const result = await query(
      `INSERT INTO products (name, description, price, old_price, category, image_url, stock, is_featured, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
       RETURNING *`,
      [
        name,
        description,
        price,
        oldPrice,
        category,
        imageUrl,
        stock,
        isFeatured,
      ]
    );

    return Product.formatProduct(result.rows[0]);
  },

  findById: async (id, client = null) => {
    const db = client || { query };
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    return result.rows[0] ? Product.formatProduct(result.rows[0]) : null;
  },

  findAll: async (filters = {}) => {
    const { page = 1, limit = 20, category, isActive = true, search } = filters;
    const offset = (page - 1) * limit;

    let queryText = "SELECT * FROM products WHERE 1=1";
    const params = [];
    let paramCount = 1;

    // Filtro de categoria
    if (category) {
      queryText += ` AND LOWER(category) = LOWER($${paramCount})`;
      params.push(category);
      paramCount++;
    }

    // Filtro de status (ativo/inativo)
    if (isActive !== undefined) {
      queryText += ` AND is_active = $${paramCount}`;
      params.push(isActive);
      paramCount++;
    }

    // Busca por nome ou descrição
    if (search) {
      queryText += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Ordenação e paginação
    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${
      paramCount + 1
    }`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows.map(Product.formatProduct);
  },

  count: async (filters = {}) => {
    const { category, isActive = true, search } = filters;

    let queryText = "SELECT COUNT(*) as total FROM products WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (category) {
      queryText += ` AND LOWER(category) = LOWER($${paramCount})`;
      params.push(category);
      paramCount++;
    }

    if (isActive !== undefined) {
      queryText += ` AND is_active = $${paramCount}`;
      params.push(isActive);
      paramCount++;
    }

    if (search) {
      queryText += ` AND (LOWER(name) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
      params.push(`%${search}%`);
      paramCount++;
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].total);
  },

  findFeatured: async (limit = 10) => {
    const result = await query(
      `SELECT * FROM products 
       WHERE is_active = true AND (is_featured = true OR old_price IS NOT NULL)
       ORDER BY 
         CASE WHEN old_price IS NOT NULL 
           THEN ((old_price - price) / old_price) * 100 
           ELSE 0 
         END DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map(Product.formatProduct);
  },

  findByCategory: async (category) => {
    const result = await query(
      "SELECT * FROM products WHERE LOWER(category) = LOWER($1) AND is_active = true ORDER BY name",
      [category]
    );

    return result.rows.map(Product.formatProduct);
  },

  update: async (id, productData) => {
    const {
      name,
      description,
      price,
      oldPrice,
      category,
      imageUrl,
      stock,
      isFeatured,
      isActive,
    } = productData;

    const result = await query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           old_price = $4,
           category = COALESCE($5, category),
           image_url = COALESCE($6, image_url),
           stock = COALESCE($7, stock),
           is_featured = COALESCE($8, is_featured),
           is_active = COALESCE($9, is_active),
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        name,
        description,
        price,
        oldPrice,
        category,
        imageUrl,
        stock,
        isFeatured,
        isActive,
        id,
      ]
    );

    return result.rows[0] ? Product.formatProduct(result.rows[0]) : null;
  },

  toggleActive: async (id) => {
    const result = await query(
      `UPDATE products 
       SET is_active = NOT is_active, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return result.rows[0] ? Product.formatProduct(result.rows[0]) : null;
  },

  updateStock: async (id, stock, client = null) => {
    const db = client || { query };
    const result = await db.query(
      "UPDATE products SET stock = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [stock, id]
    );

    return result.rows[0] ? Product.formatProduct(result.rows[0]) : null;
  },

  decrementStock: async (id, quantity, client = null) => {
    const db = client || { query };
    const result = await db.query(
      "UPDATE products SET stock = stock - $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [quantity, id]
    );

    return result.rows[0] ? Product.formatProduct(result.rows[0]) : null;
  },

  delete: async (id) => {
    await query("DELETE FROM products WHERE id = $1", [id]);
    return true;
  },

  findLowStock: async (threshold = 20) => {
    const result = await query(
      "SELECT * FROM products WHERE stock < $1 AND is_active = true ORDER BY stock ASC",
      [threshold]
    );

    return result.rows.map(Product.formatProduct);
  },

  countLowStock: async (threshold = 20) => {
    const result = await query(
      "SELECT COUNT(*) as total FROM products WHERE stock < $1 AND is_active = true",
      [threshold]
    );
    return parseInt(result.rows[0].total);
  },
};

module.exports = Product;
