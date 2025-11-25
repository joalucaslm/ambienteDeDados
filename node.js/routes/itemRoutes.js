// routes/itemRoutes.js

const express = require("express");
const itemController = require("../controller/itemController");

const router = express.Router();

router.get("/", itemController.getItens);
router.get("/tipo/:idTipo", itemController.getItensByTipo);
router.get("/:id", itemController.getItemById);
router.post("/", itemController.createItem);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
