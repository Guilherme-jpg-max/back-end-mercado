const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const orderValidator = require("../validators/orderValidator");
const { authenticate } = require("../middleware/auth");

// Todas as rotas de pedidos requerem autenticação
router.use(authenticate);

// POST /api/orders - Criar novo pedido
router.post("/", orderValidator.create, orderController.create);

// GET /api/orders/my-orders - Listar pedidos do usuário
router.get("/my-orders", orderController.getMyOrders);

// GET /api/orders/:id - Obter pedido por ID
router.get("/:id", orderController.getById);

module.exports = router;
