require("dotenv").config();
const express = require("express");
const pedidoRoutes = require("./routes/pedidoRoutes");

const app = express();

const NODE_ENV = process.env.NODE_ENV || "dev";
const PORT = Number(process.env.PORT) || 8080;

app.use("/pedido", pedidoRoutes);

app.use((err, req, res, _next) => {
  console.error("[Express Error]", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`API em ${NODE_ENV} ouvindo na porta ${PORT}`);
});
