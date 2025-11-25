// controller/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Importar bcryptjs
const ClienteModel = require("../models/clienteModel");

// POST /auth/register - Registrar novo usuário
const register = async (req, res) => {
  try {
    const { nome, email, telefone, senha } = req.body; // Adicionar senha

    // Validações
    if (!nome || !email || !telefone || !senha) { // Senha agora é obrigatória
      return res.status(400).json({
        success: false,
        message: "nome, email, telefone e senha são obrigatórios"
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Formato de email inválido"
      });
    }

    // Validar comprimento da senha
    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: "A senha deve ter no mínimo 6 caracteres"
      });
    }

    // Verificar se email já existe
    const clienteExistente = await ClienteModel.findByEmail(email);
    if (clienteExistente) {
      return res.status(409).json({
        success: false,
        message: "Email já cadastrado"
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10); // 10 é o saltRounds

    // Criar novo cliente
    const novoClienteId = await ClienteModel.create({
      nome,
      email,
      telefone,
      senha: hashedPassword // Armazenar senha hash
    });

    // Gerar JWT
    const token = jwt.sign(
      { id: novoClienteId, email: email },
      process.env.SECRET_KEY || "sua_chave_secreta_aqui",
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      success: true,
      data: {
        id: novoClienteId,
        nome,
        email,
        token,
        expiresIn: "24h"
      },
      message: "Usuário registrado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// POST /auth/login - Fazer login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios"
      });
    }

    // Buscar cliente por email
    const cliente = await ClienteModel.findByEmail(email);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    // Verificar senha
    const isMatch = await ClienteModel.comparePassword(senha, cliente.senha);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Senha incorreta"
      });
    }

    // Gerar JWT
    const token = jwt.sign(
      { id: cliente.id, email: cliente.email },
      process.env.SECRET_KEY || "sua_chave_secreta_aqui",
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      data: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        token,
        expiresIn: "24h"
      },
      message: "Login realizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};
