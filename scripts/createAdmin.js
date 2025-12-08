const bcrypt = require("bcrypt");
const { query } = require("../src/config/database");
require("dotenv").config();

async function createAdmin() {
  const email = "admin@supermercado.com";
  const password = "admin123";
  const name = "Administrador";

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, "admin"]
    );

    console.log(" Admin criado com sucesso!");
    console.log(" Email:", email);
    console.log(" Senha:", password);
    console.log("");
    console.log("Use essas credenciais para fazer login no admin panel");
  } catch (error) {
    if (error.code === "23505") {
      console.log("  Email já existe. Promovendo para admin...");
      await query("UPDATE users SET role = $1 WHERE email = $2", [
        "admin",
        email,
      ]);
      console.log(" Usuário promovido para admin!");
      console.log(" Email:", email);
      console.log(" Senha: (a senha que você definiu anteriormente)");
    } else {
      console.error(" Erro:", error.message);
    }
  }

  process.exit(0);
}

createAdmin();
