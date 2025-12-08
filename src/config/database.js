const { Pool } = require("pg");
require("dotenv").config();

// Configuração do pool - funciona LOCAL e no RENDER
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        // PRODUÇÃO (Render) - usa DATABASE_URL
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
    : {
        // DESENVOLVIMENTO (Local) - usa variáveis separadas
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

// Evento de erro do pool
pool.on("error", (err) => {
  console.error("❌ Erro inesperado no pool do banco de dados:", err);
  process.exit(-1);
});

// Testar conexão
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Erro ao conectar no banco de dados:", err);
  } else {
    console.log("✅ Conectado ao banco de dados PostgreSQL");
    console.log("📅 Data/Hora do servidor:", res.rows[0].now);
  }
});

// Função helper para queries
const query = (text, params) => pool.query(text, params);

// Função helper para transações
const getClient = () => pool.connect();

module.exports = {
  pool,
  query,
  getClient,
};
