// routes/enderecoRoutes.js

const express = require("express");
const router = express.Router();
const EnderecoController = require("../controller/enderecoController");

// GET /endereco - Buscar todos os endereços
router.get("/", EnderecoController.getEnderecos);

// GET /endereco/:id - Buscar endereço por ID
// GET /cliente/:idCliente/endereco - Buscar endereços de um cliente
router.get("/cliente/:idCliente", EnderecoController.getEnderecosByCliente);

// GET /restaurante/:idRestaurante/endereco - Buscar endereço de um restaurante
router.get("/restaurante/:idRestaurante", EnderecoController.getEnderecoByRestaurante);

// GET /endereco/:id - Buscar endereço por ID
router.get("/:id", EnderecoController.getEnderecoById);

// POST /endereco - Criar novo endereço
router.post("/", EnderecoController.createEndereco);

// PUT /endereco/:id - Atualizar endereço
router.put("/:id", EnderecoController.updateEndereco);

// DELETE /endereco/:id - Deletar endereço
router.delete("/:id", EnderecoController.deleteEndereco);

module.exports = router;
