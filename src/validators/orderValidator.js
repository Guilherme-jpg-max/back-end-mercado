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

const orderValidator = {
  create: [
    body("items")
      .isArray({ min: 1 })
      .withMessage("O carrinho não pode estar vazio")
      .custom((items) => {
        if (
          !items.every(
            (item) => item.id && item.quantity && item.price && item.name
          )
        ) {
          throw new Error(
            "Todos os itens devem ter id, nome, quantidade e preço"
          );
        }
        return true;
      }),

    body("items.*.id").isInt().withMessage("ID do produto inválido"),

    body("items.*.name")
      .trim()
      .notEmpty()
      .withMessage("Nome do produto é obrigatório"),

    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantidade deve ser no mínimo 1"),

    body("items.*.price").isFloat({ min: 0 }).withMessage("Preço inválido"),

    body("items.*.imageUrl")
      .optional()
      .trim()
      .isURL()
      .withMessage("URL da imagem inválida"),

    body("total").isFloat({ min: 0.01 }).withMessage("Total inválido"),

    body("paymentMethod")
      .trim()
      .notEmpty()
      .withMessage("Método de pagamento é obrigatório")
      .isIn(["credit_card", "debit_card", "pix", "cash"])
      .withMessage("Método de pagamento inválido"),

    body("deliveryAddress")
      .isObject()
      .withMessage("Endereço de entrega é obrigatório"),

    body("deliveryAddress.street")
      .trim()
      .notEmpty()
      .withMessage("Rua é obrigatória"),

    body("deliveryAddress.number")
      .trim()
      .notEmpty()
      .withMessage("Número é obrigatório"),

    body("deliveryAddress.complement").optional().trim(),

    body("deliveryAddress.neighborhood")
      .trim()
      .notEmpty()
      .withMessage("Bairro é obrigatório"),

    body("deliveryAddress.city")
      .trim()
      .notEmpty()
      .withMessage("Cidade é obrigatória"),

    body("deliveryAddress.state")
      .trim()
      .notEmpty()
      .withMessage("Estado é obrigatório")
      .isLength({ min: 2, max: 2 })
      .withMessage("Estado deve ter 2 caracteres (ex: SP)")
      .isUppercase()
      .withMessage("Estado deve estar em maiúsculas"),

    body("deliveryAddress.zipCode")
      .trim()
      .notEmpty()
      .withMessage("CEP é obrigatório")
      .matches(/^\d{5}-?\d{3}$/)
      .withMessage("CEP inválido. Use o formato: 12345-678"),

    handleValidationErrors,
  ],

  updateStatus: [
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status é obrigatório")
      .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled"])
      .withMessage("Status inválido"),

    handleValidationErrors,
  ],
};

module.exports = orderValidator;
