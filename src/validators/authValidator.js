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

const authValidator = {
  register: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Nome é obrigatório")
      .isLength({ min: 3 })
      .withMessage("Nome deve ter no mínimo 3 caracteres")
      .isLength({ max: 255 })
      .withMessage("Nome deve ter no máximo 255 caracteres"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email é obrigatório")
      .isEmail()
      .withMessage("Email inválido")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Senha é obrigatória")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter no mínimo 6 caracteres")
      .isLength({ max: 100 })
      .withMessage("Senha deve ter no máximo 100 caracteres"),

    body("phone")
      .optional()
      .trim()
      .matches(/^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/)
      .withMessage("Telefone inválido. Use o formato: (11) 99999-9999"),

    handleValidationErrors,
  ],

  login: [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email é obrigatório")
      .isEmail()
      .withMessage("Email inválido")
      .normalizeEmail(),

    body("password").notEmpty().withMessage("Senha é obrigatória"),

    handleValidationErrors,
  ],

  updateProfile: [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage("Nome deve ter no mínimo 3 caracteres")
      .isLength({ max: 255 })
      .withMessage("Nome deve ter no máximo 255 caracteres"),

    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Email inválido")
      .normalizeEmail(),

    body("phone")
      .optional()
      .trim()
      .matches(/^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/)
      .withMessage("Telefone inválido"),

    handleValidationErrors,
  ],

  changePassword: [
    body("currentPassword").notEmpty().withMessage("Senha atual é obrigatória"),

    body("newPassword")
      .notEmpty()
      .withMessage("Nova senha é obrigatória")
      .isLength({ min: 6 })
      .withMessage("Nova senha deve ter no mínimo 6 caracteres")
      .isLength({ max: 100 })
      .withMessage("Nova senha deve ter no máximo 100 caracteres"),

    handleValidationErrors,
  ],
};

module.exports = authValidator;
