// routes/clienteRoutes.js

const express = require("express");
const clienteController = require("../controller/clienteController");

const router = express.Router();

// GET /cliente - Listar todos os clientes
router.get("/", clienteController.getClientes);

// GET /cliente/:id - Buscar cliente por ID
router.get("/:id", clienteController.getClienteById);

// POST /cliente - Criar novo cliente
router.post("/", clienteController.createCliente);

// PUT /cliente/:id - Atualizar cliente
router.put("/:id", clienteController.updateCliente);

// DELETE /cliente/:id - Deletar cliente
router.delete("/:id", clienteController.deleteCliente);

// PUT /cliente/:id/password - Atualizar senha do cliente
router.put("/:id/password", clienteController.updatePassword);

module.exports = router;
