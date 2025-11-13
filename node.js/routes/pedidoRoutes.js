console.log("### LENDO ROTAS (v2) ###");
const express = require("express");
const pedidoController = require("../controller/pedidoController");

const router = express.Router();

// GET /pedido (Listar todos)
router.get("/", pedidoController.getPedidos);

// POST /pedido (Criar novo)
router.post("/", (req, res) => {
  res.send("ROTA DE POST FUNCIONOU!");
});
// GET /pedido/:idPedido (Buscar por ID do Pedido)
router.get("/:idPedido", pedidoController.getPedidoById);

// GET /pedido/usuario/:idUsuario (Buscar por ID do Usuário)
// (Note que mudei o path para /usuario/:idUsuario para não dar conflito com /:idPedido)
router.get("/usuario/:idUsuario", pedidoController.getPedidosByUsuario);

router.put("/:idPedido", pedidoController.updatePedidoStatus);


module.exports = router;