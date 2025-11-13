require("dotenv").config();
const express = require("express");
const pedidoRoutes = require("./routes/pedidoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const restauranteRoutes = require("./routes/restauranteRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const entregadorRoutes = require("./routes/entregadorRoutes");
const itemRoutes = require("./routes/itemRoutes");
const horarioFuncionamentoRoutes = require("./routes/horarioFuncionamentoRoutes");
const enderecoRoutes = require("./routes/enderecoRoutes");
const authRoutes = require("./routes/authRoutes");

// 1. IMPORTAR A FUNÇÃO DE TESTE
// (Ajuste o caminho se o seu arquivo de config tiver outro nome/local)
const { testConnection } = require("./config/db"); 

const app = express();

const NODE_ENV = process.env.NODE_ENV || "dev";
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());
app.use("/pedido", pedidoRoutes);
app.use("/cliente", clienteRoutes);
app.use("/restaurante", restauranteRoutes);
app.use("/pagamento", pagamentoRoutes);
app.use("/entregador", entregadorRoutes);
app.use("/item", itemRoutes);
app.use("/horario", horarioFuncionamentoRoutes);
app.use("/endereco", enderecoRoutes);
app.use("/auth", authRoutes);

app.use((err, req, res, _next) => {
  console.error("[Express Error]", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`API em ${NODE_ENV} ouvindo na porta ${PORT}`);
  
  // 2. CHAMAR A FUNÇÃO DE TESTE NA INICIALIZAÇÃO
  testConnection();
});