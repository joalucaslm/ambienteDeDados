require("dotenv").config();
const express = require("express");
const cors = require("cors");
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

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Whitelist of allowed origins from environment variable
    const whitelist = (process.env.CORS_WHITELIST || 'http://localhost:5174,http://127.0.0.1:5500,http://127.0.0.1:3000,http://localhost:3000').split(',');

    // Log the incoming origin to the console for debugging
    console.log("CORS check: Request from origin =>", origin);
    
    // Allow requests with no origin (like mobile apps, curl, or local files)
    // or requests from the whitelist.
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
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
