// routes/restauranteRoutes.js

const express = require("express");
const restauranteController = require("../controller/restauranteController");

const router = express.Router();

router.get("/", restauranteController.getRestaurantes);

router.get("/preco/:preco", restauranteController.getRestaurantesByPreco);

router.get("/:id", restauranteController.getRestauranteById);

router.get("/:id/pedidos", restauranteController.getPedidosByRestaurante);

router.post("/", restauranteController.createRestaurante);

router.put("/:id", restauranteController.updateRestaurante);

router.delete("/:id", restauranteController.deleteRestaurante);

router.post("/tipoCozinha", restauranteController.createTipoCozinha);


module.exports = router;
