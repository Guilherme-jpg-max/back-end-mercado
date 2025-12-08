const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// GET /api/categories - Listar todas as categorias
router.get("/", categoryController.getAll);

// GET /api/categories/:id - Obter categoria por ID
router.get("/:id", categoryController.getById);

module.exports = router;
