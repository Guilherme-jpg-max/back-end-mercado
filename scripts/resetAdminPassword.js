const bcrypt = require("bcrypt");
const { query } = require("../src/config/database");
require("dotenv").config();

async function resetAdminPassword() {
  const email = "admin@supermercado.com";
  const newPassword = "admin123";

  console.log(" Gerando hash da senha...");
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  console.log("Hash gerado:", hashedPassword);
  console.log("Tamanho do hash:", hashedPassword.length, "caracteres");

  try {
    const result = await query(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING id, name, email",
      [hashedPassword, email]
    );

    if (result.rows.length > 0) {
      console.log("");
      console.log(" Senha redefinida com sucesso!");
      console.log("");
      console.log(" Email:", email);
      console.log(" Senha:", newPassword);
      console.log("");
      console.log("Agora você pode fazer login no admin panel!");
    } else {
      console.log(" Usuário não encontrado");
    }
  } catch (error) {
    console.error("Erro:", error.message);
  }

  process.exit(0);
}

resetAdminPassword().catch(console.error);
