const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
      details: errors.array(),
    });
  }
  next();
};

const productValidator = {
  create: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Nome do produto é obrigatório")
      .isLength({ min: 3 })
      .withMessage("Nome deve ter no mínimo 3 caracteres")
      .isLength({ max: 255 })
      .withMessage("Nome deve ter no máximo 255 caracteres"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Descrição é obrigatória")
      .isLength({ min: 10 })
      .withMessage("Descrição deve ter no mínimo 10 caracteres"),

    body("price")
      .notEmpty()
      .withMessage("Preço é obrigatório")
      .isFloat({ min: 0.01 })
      .withMessage("Preço deve ser maior que 0"),

    body("oldPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Preço antigo deve ser um número válido"),

    body("category")
      .trim()
      .notEmpty()
      .withMessage("Categoria é obrigatória")
      .isIn([
        "Hortifruti",
        "Bebidas",
        "Açougue",
        "Laticínios",
        "Grãos",
        "Limpeza",
        "Higiene",
        "Padaria",
      ])
      .withMessage("Categoria inválida"),

    body("imageUrl")
      .trim()
      .notEmpty()
      .withMessage("URL da imagem é obrigatória")
      .isURL()
      .withMessage("URL da imagem inválida"),

    body("stock")
      .notEmpty()
      .withMessage("Estoque é obrigatório")
      .isInt({ min: 0 })
      .withMessage("Estoque deve ser um número inteiro não negativo"),

    body("isFeatured")
      .optional()
      .isBoolean()
      .withMessage("isFeatured deve ser boolean"),

    handleValidationErrors,
  ],

  update: [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Nome deve ter no mínimo 3 caracteres")
      .isLength({ max: 255 })
      .withMessage("Nome deve ter no máximo 255 caracteres"),

    body("description")
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage("Descrição deve ter no mínimo 10 caracteres"),

    body("price")
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage("Preço deve ser maior que 0"),

    body("oldPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Preço antigo deve ser um número válido"),

    body("category")
      .optional()
      .trim()
      .isIn([
        "Hortifruti",
        "Bebidas",
        "Açougue",
        "Laticínios",
        "Grãos",
        "Limpeza",
        "Higiene",
        "Padaria",
      ])
      .withMessage("Categoria inválida"),

    body("imageUrl")
      .optional()
      .trim()
      .isURL()
      .withMessage("URL da imagem inválida"),

    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Estoque deve ser um número inteiro não negativo"),

    body("isFeatured")
      .optional()
      .isBoolean()
      .withMessage("isFeatured deve ser boolean"),

    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive deve ser boolean"),

    handleValidationErrors,
  ],
  updateStock: [
    body("stock")
      .notEmpty()
      .withMessage("Estoque é obrigatório")
      .isInt({ min: 0 })
      .withMessage("Estoque deve ser um número inteiro não negativo"),

    handleValidationErrors,
  ],
};

module.exports = productValidator;
