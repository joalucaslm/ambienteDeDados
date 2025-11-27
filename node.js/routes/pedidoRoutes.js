console.log("### LENDO ROTAS (v2) ###");
const express = require("express");
const pedidoController = require("../controller/pedidoController");

const router = express.Router();

// Rota para buscar pedidos de um cliente específico via query param
router.get("/", pedidoController.getPedidosByCliente);

// GET /pedido/all (Listar todos)
router.get("/all", pedidoController.getPedidos);

// POST /pedido (Criar novo)
router.post("/", pedidoController.createPedido);
// GET /pedido/:idPedido (Buscar por ID do Pedido)
// GET /pedido/usuario/:idUsuario (Buscar por ID do Usuário)
// (Note que mudei o path para /usuario/:idUsuario para não dar conflito com /:idPedido)
router.get("/usuario/:idUsuario", pedidoController.getPedidosByUsuario);

// GET /pedido/:idPedido (Buscar por ID do Pedido)
router.get("/:idPedido", pedidoController.getPedidoById);

router.patch("/:idPedido/status", pedidoController.patchPedidoStatus);

router.get("/:idPedido/allInfos", pedidoController.getPedidoInfoById);




module.exports = router;