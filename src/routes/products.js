const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// GET /api/products - Listar todos os produtos (com paginação e filtros)
router.get("/", productController.getAll);

// GET /api/products/search - Buscar produtos
router.get("/search", productController.search);

// GET /api/products/featured - Produtos em destaque
router.get("/featured", productController.getFeatured);

// GET /api/products/category/:category - Produtos por categoria
router.get("/category/:category", productController.getByCategory);

// GET /api/products/:id - Obter produto por ID
router.get("/:id", productController.getById);

module.exports = router;
