const express = require("express");
const router = express.Router();

// Importar rotas
const authRoutes = require("./auth");
const productRoutes = require("./products");
const orderRoutes = require("./orders");
const categoryRoutes = require("./categories");
const adminRoutes = require("./admin");
const contactRoutes = require("./contact");

// Registrar rotas
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", adminRoutes);
router.use("/contact", contactRoutes);

module.exports = router;
