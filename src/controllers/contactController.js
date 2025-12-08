const { query } = require("../config/database");

const contactController = {
  sendMessage: async (req, res, next) => {
    try {
      const { name, email, phone, subject, message } = req.body;

      // Validações básicas
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Dados inválidos" });
      }

      // Inserir mensagem no banco
      await query(
        `INSERT INTO contact_messages (name, email, phone, subject, message, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [name, email, phone, subject, message]
      );

      res.json({
        message: "Mensagem enviada com sucesso",
      });
    } catch (error) {
      next(error);
    }
  },

  getAllMessages: async (req, res, next) => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const result = await query(
        `SELECT * FROM contact_messages 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const countResult = await query(
        "SELECT COUNT(*) as total FROM contact_messages"
      );
      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);

      res.json({
        messages: result.rows,
        total,
        page: parseInt(page),
        totalPages,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = contactController;
