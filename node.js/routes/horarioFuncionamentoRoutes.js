// routes/horarioFuncionamentoRoutes.js

const express = require("express");
const horarioFuncionamentoController = require("../controller/horarioFuncionamentoController");

const router = express.Router();

router.get("/", horarioFuncionamentoController.getHorarios);
router.get("/:id", horarioFuncionamentoController.getHorarioById);
router.post("/", horarioFuncionamentoController.createHorario);
router.put("/:id", horarioFuncionamentoController.updateHorario);
router.delete("/:id", horarioFuncionamentoController.deleteHorario);

module.exports = router;
