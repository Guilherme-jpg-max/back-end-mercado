const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

async function createAdmin() {
  // Conectar usando DATABASE_URL (Render)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const email = "admin@supermercado.com";
  const password = "admin123";
  const name = "Administrador";

  try {
    console.log("🔄 Gerando hash da senha...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔄 Criando usuário admin...");
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, "admin"]
    );

    console.log(" Admin criado com sucesso!");
    console.log(" Email:", email);
    console.log(" Senha:", password);
    console.log("");
    console.log("  IMPORTANTE: Altere a senha depois do primeiro login!");
  } catch (error) {
    if (error.code === "23505") {
      console.log("ℹ  Email já existe. Promovendo para admin...");
      await pool.query("UPDATE users SET role = $1 WHERE email = $2", [
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

  await pool.end();
  process.exit(0);
}

createAdmin();
