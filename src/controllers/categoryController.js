const Category = require("../models/Category");

const categoryController = {
  getAll: async (req, res, next) => {
    try {
      const categories = await Category.findAll();

      res.json({
        categories,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const category = await Category.findById(parseInt(id));

      if (!category) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.json(category);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
