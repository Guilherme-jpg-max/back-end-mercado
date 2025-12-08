const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
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

// POST /api/contact - Enviar mensagem de contato
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Nome é obrigatório")
      .isLength({ min: 3 })
      .withMessage("Nome deve ter no mínimo 3 caracteres"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email é obrigatório")
      .isEmail()
      .withMessage("Email inválido")
      .normalizeEmail(),
    body("phone").optional().trim(),
    body("subject")
      .trim()
      .notEmpty()
      .withMessage("Assunto é obrigatório")
      .isLength({ min: 5 })
      .withMessage("Assunto deve ter no mínimo 5 caracteres"),
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Mensagem é obrigatória")
      .isLength({ min: 10 })
      .withMessage("Mensagem deve ter no mínimo 10 caracteres"),
    handleValidationErrors,
  ],
  contactController.sendMessage
);

module.exports = router;
