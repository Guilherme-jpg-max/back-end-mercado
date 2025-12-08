const { query } = require("../config/database");

const Order = {
  formatOrder: (order, items = []) => {
    return {
      id: order.id,
      userId: order.user_id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      total: parseFloat(order.total),
      paymentMethod: order.payment_method,
      deliveryAddress: {
        street: order.delivery_street,
        number: order.delivery_number,
        complement: order.delivery_complement,
        neighborhood: order.delivery_neighborhood,
        city: order.delivery_city,
        state: order.delivery_state,
        zipCode: order.delivery_zip_code,
      },
      status: order.status,
      items: items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        subtotal: parseFloat(item.subtotal),
        imageUrl: item.image_url,
      })),
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };
  },

  create: async (orderData, client) => {
    const {
      userId,
      customerName,
      customerEmail,
      total,
      paymentMethod,
      deliveryAddress,
    } = orderData;

    const result = await client.query(
      `INSERT INTO orders (
        user_id, customer_name, customer_email, total, payment_method,
        delivery_street, delivery_number, delivery_complement, 
        delivery_neighborhood, delivery_city, delivery_state, delivery_zip_code,
        status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *`,
      [
        userId,
        customerName,
        customerEmail,
        total,
        paymentMethod,
        deliveryAddress.street,
        deliveryAddress.number,
        deliveryAddress.complement,
        deliveryAddress.neighborhood,
        deliveryAddress.city,
        deliveryAddress.state,
        deliveryAddress.zipCode,
        "pending",
      ]
    );

    return result.rows[0];
  },

  createItem: async (orderItemData, client) => {
    const {
      orderId,
      productId,
      productName,
      price,
      quantity,
      subtotal,
      imageUrl,
    } = orderItemData;

    const result = await client.query(
      `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [orderId, productId, productName, price, quantity, subtotal, imageUrl]
    );

    return result.rows[0];
  },

  findByIdWithItems: async (id) => {
    const orderResult = await query("SELECT * FROM orders WHERE id = $1", [id]);

    if (orderResult.rows.length === 0) {
      return null;
    }

    const itemsResult = await query(
      "SELECT * FROM order_items WHERE order_id = $1",
      [id]
    );

    return Order.formatOrder(orderResult.rows[0], itemsResult.rows);
  },

  findByUserId: async (userId, limit = 10, offset = 0) => {
    const ordersResult = await query(
      `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      );
      orders.push(Order.formatOrder(order, itemsResult.rows));
    }

    return orders;
  },

  countByUserId: async (userId) => {
    const result = await query(
      "SELECT COUNT(*) as total FROM orders WHERE user_id = $1",
      [userId]
    );
    return parseInt(result.rows[0].total);
  },

  findAll: async (filters = {}) => {
    const { page = 1, limit = 20, status } = filters;
    const offset = (page - 1) * limit;

    let queryText = "SELECT * FROM orders WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (status) {
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${
      paramCount + 1
    }`;
    params.push(limit, offset);

    const ordersResult = await query(queryText, params);

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      );
      orders.push(Order.formatOrder(order, itemsResult.rows));
    }

    return orders;
  },

  count: async (filters = {}) => {
    const { status } = filters;

    let queryText = "SELECT COUNT(*) as total FROM orders WHERE 1=1";
    const params = [];

    if (status) {
      queryText += " AND status = $1";
      params.push(status);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].total);
  },
  updateStatus: async (id, status) => {
    const result = await query(
      "UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );

    return result.rows[0];
  },

  findRecent: async (limit = 5) => {
    const ordersResult = await query(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT $1",
      [limit]
    );

    const orders = [];

    for (const order of ordersResult.rows) {
      const itemsResult = await query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.id]
      );
      orders.push(Order.formatOrder(order, itemsResult.rows));
    }

    return orders;
  },

  countByStatus: async (status) => {
    const result = await query(
      "SELECT COUNT(*) as total FROM orders WHERE status = $1",
      [status]
    );
    return parseInt(result.rows[0].total);
  },

  getTodaySales: async () => {
    const result = await query(
      `SELECT COALESCE(SUM(total), 0) as total 
       FROM orders 
       WHERE DATE(created_at) = CURRENT_DATE 
       AND status != 'cancelled'`
    );
    return parseFloat(result.rows[0].total);
  },

  getSalesByPeriod: async (startDate, endDate) => {
    const result = await query(
      `SELECT COALESCE(SUM(total), 0) as total 
       FROM orders 
       WHERE created_at BETWEEN $1 AND $2 
       AND status != 'cancelled'`,
      [startDate, endDate]
    );
    return parseFloat(result.rows[0].total);
  },

  delete: async (id) => {
    await query("DELETE FROM orders WHERE id = $1", [id]);
    return true;
  },
};

module.exports = Order;
