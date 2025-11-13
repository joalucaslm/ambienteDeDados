console.log("### LENDO ROTAS (v2) ###");
const express = require("express");
const pedidoController = require("../controller/pedidoController");

const router = express.Router();

// GET /pedido (Listar todos)
router.get("/", pedidoController.getPedidos);

// POST /pedido (Criar novo)
router.post("/", pedidoController.createPedido);
// GET /pedido/:idPedido (Buscar por ID do Pedido)
// GET /pedido/usuario/:idUsuario (Buscar por ID do Usuário)
// (Note que mudei o path para /usuario/:idUsuario para não dar conflito com /:idPedido)
router.get("/usuario/:idUsuario", pedidoController.getPedidosByUsuario);

// GET /pedido/:idPedido (Buscar por ID do Pedido)
router.get("/:idPedido", pedidoController.getPedidoById);

router.put("/:idPedido", pedidoController.updatePedidoStatus);


module.exports = router;