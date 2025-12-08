const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productValidator = require("../validators/productValidator");
const orderValidator = require("../validators/orderValidator");
const { authenticate, requireAdmin } = require("../middleware/auth");

router.use(authenticate, requireAdmin);

// PRODUTOS

// POST /api/admin/products - Criar produto
router.post(
  "/products",
  productValidator.create,
  adminController.createProduct
);

// PUT /api/admin/products/:id - Atualizar produto
router.put(
  "/products/:id",
  productValidator.update,
  adminController.updateProduct
);

// DELETE /api/admin/products/:id - Deletar produto
router.delete("/products/:id", adminController.deleteProduct);

// PATCH /api/admin/products/:id/toggle-active - Alternar status
router.patch(
  "/products/:id/toggle-active",
  adminController.toggleProductActive
);

// PATCH /api/admin/products/:id/stock - Atualizar estoque
router.patch(
  "/products/:id/stock",
  productValidator.updateStock,
  adminController.updateProductStock
);

// PEDIDOS

// GET /api/admin/orders - Listar todos os pedidos
router.get("/orders", adminController.getAllOrders);

// GET /api/admin/orders/:id - Obter pedido por ID
router.get("/orders/:id", adminController.getOrderById);

// PATCH /api/admin/orders/:id/status - Atualizar status do pedido
router.patch(
  "/orders/:id/status",
  orderValidator.updateStatus,
  adminController.updateOrderStatus
);

// DASHBOARD

// GET /api/admin/dashboard/stats - Estatísticas
router.get("/dashboard/stats", adminController.getDashboardStats);

// GET /api/admin/dashboard/recent-orders - Pedidos recentes
router.get("/dashboard/recent-orders", adminController.getRecentOrders);

module.exports = router;
