const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function initDatabase() {
  // Conectar usando DATABASE_URL (Render)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🔄 Conectando ao banco de dados...");

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, "createTables.sql");
    let sql = fs.readFileSync(sqlPath, "utf8");

    // Remover comandos que não funcionam no Render
    sql = sql.replace(
      /DROP DATABASE IF EXISTS supermercado;/g,
      "-- DROP DATABASE (comentado)"
    );
    sql = sql.replace(
      /CREATE DATABASE supermercado;/g,
      "-- CREATE DATABASE (comentado)"
    );
    sql = sql.replace(/\\c supermercado;/g, "-- conectar (comentado)");
    sql = sql.replace(
      /GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;/g,
      ""
    );
    sql = sql.replace(
      /GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;/g,
      ""
    );

    console.log("📝 Executando SQL...");

    // Dividir por ponto-e-vírgula e executar comando por comando
    const commands = sql
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd && !cmd.startsWith("--") && cmd.length > 0);

    for (const command of commands) {
      if (command) {
        await pool.query(command);
      }
    }

    console.log("✅ Banco de dados inicializado com sucesso!");
    console.log("📊 Tabelas criadas:");

    // Listar tabelas criadas
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    result.rows.forEach((row) => {
      console.log(`   ✓ ${row.table_name}`);
    });

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao inicializar banco:", error.message);
    console.error("Stack:", error.stack);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
