const { verifyToken } = require("../config/jwt");
const { query } = require("../config/database");

const authenticate = async (req, res, next) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const token = authHeader.split(" ")[1];

    // Verificar e decodificar o token
    const decoded = verifyToken(token);

    // Buscar usuário no banco de dados
    const result = await query(
      "SELECT id, name, email, phone, role FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    // Adicionar usuário ao request
    req.user = result.rows[0];
    req.token = token;

    next();
  } catch (error) {
    if (error.message === "Token inválido ou expirado") {
      return res.status(401).json({ error: error.message });
    }
    return res.status(401).json({ error: "Falha na autenticação" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acesso negado. Apenas administradores." });
  }

  next();
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      const result = await query(
        "SELECT id, name, email, phone, role FROM users WHERE id = $1",
        [decoded.id]
      );

      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }

    next();
  } catch (error) {
    // Em caso de erro, apenas continua sem autenticação
    next();
  }
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuthenticate,
};
