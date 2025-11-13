// routes/restauranteRoutes.js

const express = require("express");
const restauranteController = require("../controller/restauranteController");

const router = express.Router();

// GET /restaurante - Listar todos os restaurantes
router.get("/", restauranteController.getRestaurantes);

// GET /restaurante/preco/:preco - Buscar por faixa de preço
router.get("/preco/:preco", restauranteController.getRestaurantesByPreco);

// GET /restaurante/:id - Buscar restaurante por ID
router.get("/:id", restauranteController.getRestauranteById);

// POST /restaurante - Criar novo restaurante
router.post("/", restauranteController.createRestaurante);

// PUT /restaurante/:id - Atualizar restaurante
router.put("/:id", restauranteController.updateRestaurante);

// DELETE /restaurante/:id - Deletar restaurante
router.delete("/:id", restauranteController.deleteRestaurante);

module.exports = router;
