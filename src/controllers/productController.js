const Product = require("../models/Product");

const productController = {
  /**
   * GET /api/products
   * Listar todos os produtos com paginação e filtros
   */
  getAll: async (req, res, next) => {
    try {
      const { page, limit, category } = req.query;

      const filters = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        category,
        isActive: true,
      };

      const products = await Product.findAll(filters);
      const total = await Product.count(filters);
      const totalPages = Math.ceil(total / filters.limit);

      res.json({
        products,
        total,
        page: filters.page,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  },
  search: async (req, res, next) => {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({ error: "Termo de busca é obrigatório" });
      }

      const filters = {
        search: q,
        isActive: true,
        limit: 50,
      };

      const products = await Product.findAll(filters);
      const total = await Product.count(filters);

      res.json({
        products,
        total,
      });
    } catch (error) {
      next(error);
    }
  },

  getFeatured: async (req, res, next) => {
    try {
      const products = await Product.findFeatured(10);

      res.json({
        products,
      });
    } catch (error) {
      next(error);
    }
  },
  getByCategory: async (req, res, next) => {
    try {
      const { category } = req.params;

      const products = await Product.findByCategory(category);
      const total = products.length;

      res.json({
        products,
        total,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(parseInt(id));

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
