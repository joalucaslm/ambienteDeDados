// routes/entregadorRoutes.js

const express = require("express");
const entregadorController = require("../controller/entregadorController");

const router = express.Router();

router.get("/", entregadorController.getEntregadores);
router.get("/status/:status", entregadorController.getEntregadorByStatus);
router.get("/:id", entregadorController.getEntregadorById);
router.post("/", entregadorController.createEntregador);
router.put("/:id", entregadorController.updateEntregador);
router.delete("/:id", entregadorController.deleteEntregador);

module.exports = router;
