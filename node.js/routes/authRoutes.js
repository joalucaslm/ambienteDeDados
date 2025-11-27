const express = require("express");
const router = express.Router();
const AuthController = require("../controller/authController");

// POST /auth/register - Registrar novo usuário
router.post("/register", AuthController.register);

// POST /auth/login - Fazer login
router.post("/login", AuthController.login);

module.exports = router;
