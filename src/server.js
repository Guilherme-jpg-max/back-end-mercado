const app = require("./app");

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log("");
  console.log(" SuperMercado API");
  console.log(` Ambiente: ${NODE_ENV}`);
  console.log(` Servidor: http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/health`);
  console.log(` API: http://localhost:${PORT}/api`);
  console.log("=".repeat(50));
  console.log("");
});

process.on("SIGTERM", () => {
  console.log(" SIGTERM recebido. Encerrando servidor...");
  server.close(() => {
    console.log(" Servidor encerrado com sucesso");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log(" SIGINT recebido. Encerrando servidor...");
  server.close(() => {
    console.log(" Servidor encerrado com sucesso");
    process.exit(0);
  });
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error(" Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error(" Uncaught Exception:", error);
  process.exit(1);
});

module.exports = server;
