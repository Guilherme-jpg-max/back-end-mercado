const Product = require("../models/Product");
const Order = require("../models/Order");

const adminController = {
  // PRODUTOS
  createProduct: async (req, res, next) => {
    try {
      const {
        name,
        description,
        price,
        oldPrice,
        category,
        imageUrl,
        stock,
        isFeatured,
      } = req.body;

      const product = await Product.create({
        name,
        description,
        price,
        oldPrice,
        category,
        imageUrl,
        stock,
        isFeatured,
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
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
      } = req.body;

      const product = await Product.update(parseInt(id), {
        name,
        description,
        price,
        oldPrice,
        category,
        imageUrl,
        stock,
        isFeatured,
        isActive,
      });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(parseInt(id));
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      await Product.delete(parseInt(id));

      res.json({ message: "Produto excluído com sucesso" });
    } catch (error) {
      next(error);
    }
  },

  toggleProductActive: async (req, res, next) => {
    try {
      const { id } = req.params;

      const product = await Product.toggleActive(parseInt(id));

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  updateProductStock: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { stock } = req.body;

      const product = await Product.updateStock(parseInt(id), stock);

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  // PEDIDOS

  getAllOrders: async (req, res, next) => {
    try {
      const { page, limit, status } = req.query;

      const filters = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status,
      };

      const orders = await Order.findAll(filters);
      const total = await Order.count(filters);
      const totalPages = Math.ceil(total / filters.limit);

      res.json({
        orders,
        total,
        page: filters.page,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  },

  getOrderById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const order = await Order.findByIdWithItems(parseInt(id));

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  },

  updateOrderStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Buscar pedido atual
      const order = await Order.findByIdWithItems(parseInt(id));

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      // Validar transições de status
      const validTransitions = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["shipped", "cancelled"],
        shipped: ["delivered"],
        delivered: [],
        cancelled: [],
      };

      if (!validTransitions[order.status].includes(status)) {
        return res.status(400).json({
          error: `Transição de status inválida: ${order.status} → ${status}`,
        });
      }

      // Atualizar status
      const updatedOrder = await Order.updateStatus(parseInt(id), status);

      // Buscar pedido completo atualizado
      const completeOrder = await Order.findByIdWithItems(parseInt(id));

      res.json(completeOrder);
    } catch (error) {
      next(error);
    }
  },

  // DASHBOARD

  getDashboardStats: async (req, res, next) => {
    try {
      const todaySales = await Order.getTodaySales();
      const pendingOrders = await Order.countByStatus("pending");
      const totalProducts = await Product.count({ isActive: undefined });
      const lowStockProducts = await Product.countLowStock(20);

      res.json({
        todaySales,
        pendingOrders,
        totalProducts,
        lowStockProducts,
      });
    } catch (error) {
      next(error);
    }
  },

  getRecentOrders: async (req, res, next) => {
    try {
      const orders = await Order.findRecent(5);

      res.json({
        orders,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
