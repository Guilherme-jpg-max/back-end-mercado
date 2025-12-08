const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken } = require("../config/jwt");

const authController = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body;

      // Verificar se o email já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "E-mail já cadastrado" });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: "customer",
      });

      // Gerar token
      const token = generateToken(user);

      // Retornar usuário sem a senha
      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Buscar usuário por email incluindo senha
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Gerar token
      const token = generateToken(user);

      // Retornar usuário sem a senha
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  me: async (req, res, next) => {
    try {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      res.json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
