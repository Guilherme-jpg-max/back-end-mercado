const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authValidator = require("../validators/authValidator");
const { authenticate } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Muitas tentativas, tente novamente em 15 minutos" },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/auth/register
router.post(
  "/register",
  authLimiter,
  authValidator.register,
  authController.register
);

// POST /api/auth/login
router.post("/login", authLimiter, authValidator.login, authController.login);

// GET /api/auth/me
router.get("/me", authenticate, authController.me);

// POST /api/auth/logout
router.post("/logout", authenticate, authController.logout);

module.exports = router;
