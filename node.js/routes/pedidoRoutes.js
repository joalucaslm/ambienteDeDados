const express = require("express");
const pedidoController = require("../controller/pedidoController");

const router = express.Router();

router.get("/", pedidoController.getPedidos);
router.get("/:idPedido", pedidoController.getPedidoById);


module.exports = router;
