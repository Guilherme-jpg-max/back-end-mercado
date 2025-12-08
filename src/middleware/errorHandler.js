const errorHandler = (err, req, res, next) => {
  console.error(" Erro:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Erro de validação do express-validator
  if (err.array && typeof err.array === "function") {
    return res.status(400).json({
      error: "Erro de validação",
      details: err.array(),
    });
  }

  // Erro de validação do banco de dados (PostgreSQL)
  if (err.code) {
    switch (err.code) {
      case "23505": // unique_violation
        return res.status(409).json({
          error: "Este registro já existe no sistema",
        });
      case "23503": // foreign_key_violation
        return res.status(400).json({
          error: "Referência inválida",
        });
      case "23502": // not_null_violation
        return res.status(400).json({
          error: "Campo obrigatório não fornecido",
        });
      case "22P02": // invalid_text_representation
        return res.status(400).json({
          error: "Formato de dados inválido",
        });
    }
  }

  // Erro de token JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token inválido",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expirado",
    });
  }

  // Erro de validação genérico
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: err.message,
    });
  }

  // Erro de autorização
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Não autorizado",
    });
  }

  // Erro customizado com status
  if (err.status) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  // Erro genérico do servidor
  return res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Erro interno do servidor"
        : err.message,
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
