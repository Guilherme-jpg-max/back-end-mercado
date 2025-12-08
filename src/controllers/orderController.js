const Order = require("../models/Order");
const Product = require("../models/Product");
const { getClient } = require("../config/database");

const orderController = {
  create: async (req, res, next) => {
    const client = await getClient();

    try {
      const { items, total, paymentMethod, deliveryAddress } = req.body;
      const userId = req.user.id;
      const customerName = req.user.name;
      const customerEmail = req.user.email;

      // Validações
      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ error: "Carrinho vazio ou dados inválidos" });
      }

      await client.query("BEGIN");

      // Verificar estoque de todos os produtos ANTES de criar o pedido
      for (const item of items) {
        const product = await Product.findById(item.id, client);

        if (!product) {
          throw new Error(`Produto ${item.name} não encontrado`);
        }

        if (!product.isActive) {
          throw new Error(`Produto ${product.name} não está disponível`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Produto ${product.name} sem estoque suficiente. Disponível: ${product.stock}, Solicitado: ${item.quantity}`
          );
        }
      }

      // Criar pedido
      const order = await Order.create(
        {
          userId,
          customerName,
          customerEmail,
          total,
          paymentMethod,
          deliveryAddress,
        },
        client
      );

      // Criar items e atualizar estoque
      const orderItems = [];
      for (const item of items) {
        const orderItem = await Order.createItem(
          {
            orderId: order.id,
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
            imageUrl: item.imageUrl,
          },
          client
        );

        orderItems.push(orderItem);

        // Decrementar estoque
        await Product.decrementStock(item.id, item.quantity, client);
      }

      await client.query("COMMIT");

      // Buscar pedido completo
      const completeOrder = await Order.findByIdWithItems(order.id);

      res.status(201).json({
        order: completeOrder,
      });
    } catch (error) {
      await client.query("ROLLBACK");

      // Erros de validação de estoque ou produto
      if (
        error.message.includes("estoque") ||
        error.message.includes("não encontrado") ||
        error.message.includes("disponível")
      ) {
        return res.status(400).json({ error: error.message });
      }

      next(error);
    } finally {
      client.release();
    }
  },

  getMyOrders: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const orders = await Order.findByUserId(userId, limit, offset);
      const total = await Order.countByUserId(userId);
      const totalPages = Math.ceil(total / limit);

      res.json({
        orders,
        total,
        page,
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await Order.findByIdWithItems(orderId);

      if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado" });
      }

      // Verificar se o pedido pertence ao usuário (ou se é admin)
      if (order.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Acesso negado" });
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
