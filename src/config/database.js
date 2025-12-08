const { Pool } = require("pg");
require("dotenv").config();

// Configuração do pool de conexões do PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Configurações de pool
  max: 20, // número máximo de clientes no pool
  idleTimeoutMillis: 30000, // tempo que um cliente pode ficar ocioso
  connectionTimeoutMillis: 2000, // tempo máximo para obter conexão
});

// Evento de erro do pool
pool.on("error", (err) => {
  console.error(" Erro inesperado no pool do banco de dados:", err);
  process.exit(-1);
});

// Testar conexão
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(" Erro ao conectar no banco de dados:", err);
  } else {
    console.log(" Conectado ao banco de dados PostgreSQL");
    console.log(" Data/Hora do servidor:", res.rows[0].now);
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
