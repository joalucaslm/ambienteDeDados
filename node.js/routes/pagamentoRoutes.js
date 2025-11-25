// routes/pagamentoRoutes.js

const express = require("express");
const pagamentoController = require("../controller/pagamentoController");

const router = express.Router();

router.get("/", pagamentoController.getPagamentos);
router.get("/:id", pagamentoController.getPagamentoById);
router.post("/", pagamentoController.createPagamento);
router.put("/:id", pagamentoController.updatePagamento);
router.delete("/:id", pagamentoController.deletePagamento);

module.exports = router;
