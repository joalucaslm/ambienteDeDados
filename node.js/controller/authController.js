// controller/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Importar bcryptjs
const LoginModel = require("../models/loginModel");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validações
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username e password são obrigatórios"
      });
    }

    // Validar comprimento da senha
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "A senha deve ter no mínimo 6 caracteres"
      });
    }

    // Verificar se username já existe
    const usuarioExistente = await LoginModel.findByUsername(username);
    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: "Username já cadastrado"
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const novoUsuarioId = await LoginModel.create({
      username,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: novoUsuarioId, username },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: true,
      data: {
        id: novoUsuarioId,
        username,
        token,
        expiresIn: "24h"
      },
      message: "Usuário registrado com sucesso!"
    });

  } catch (error) {
    console.error('Erro no register:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// POST /auth/login - Fazer login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validações
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username e password são obrigatórios"
      });
    }

    // Buscar usuário
    const usuario = await LoginModel.findByUsername(username);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Username ou senha incorretos"
      });
    }

    // Verificar senha
    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        message: "Username ou senha incorretos"
      });
    }

    // Gerar JWT
    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY não definida no ambiente");
    }

    const token = jwt.sign(
      { id: usuario.idLogin, username: usuario.username },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      data: {
        id: usuario.idLogin,
        username: usuario.username,
        token,
        expiresIn: "24h"
      },
      message: "Login realizado com sucesso!"
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};
