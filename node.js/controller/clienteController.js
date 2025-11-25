// controller/clienteController.js
const bcrypt = require("bcryptjs");
const ClienteModel = require("../models/clienteModel");

// GET /cliente - Buscar todos os clientes
const getClientes = async (req, res) => {
  try {
    const clientes = await ClienteModel.findAll();
    return res.status(200).json({
      success: true,
      data: clientes,
      message: "Lista de clientes",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// GET /cliente/:id - Buscar cliente por ID
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID do cliente é obrigatório",
      });
    }

    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Cliente não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: cliente,
      message: "Cliente recuperado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// POST /cliente - Criar novo cliente
const createCliente = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    // Validações básicas
    if (!nome || !email || !telefone) {
      return res.status(400).json({
        success: false,
        message: "Nome, telefone e email são obrigatórios",
      });
    }

    // Verificar se email já existe
    const clienteExistente = await ClienteModel.findByEmail(
      email.toLowerCase()
    );
    if (clienteExistente) {
      return res.status(409).json({
        success: false,
        message: "Email já cadastrado",
      });
    }

    // Criptografar a senha
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(senha, salt);

    const novoClienteId = await ClienteModel.create({
      nome,
      email: email.toLowerCase(),
      telefone,
    });

    return res.status(201).json({
      success: true,
      data: { id: novoClienteId },
      message: "Cliente criado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// PUT /cliente/:id - Atualizar cliente
const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do cliente é obrigatório",
      });
    }

    // Verificar se cliente existe
    const cliente = await ClienteModel.findById(id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado",
      });
    }

    // Se está mudando o email, verificar se novo email já existe
    if (email && email.toLowerCase() !== cliente.email.toLowerCase()) {
      const emailExistente = await ClienteModel.findByEmail(
        email.toLowerCase()
      );
      if (emailExistente) {
        return res.status(409).json({
          success: false,
          message: "Email já cadastrado",
        });
      }
    }

    const affectedRows = await ClienteModel.update(id, {
      nome: nome || cliente.nome,
      email: email ? email.toLowerCase() : cliente.email,
      telefone: telefone || cliente.telefone,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: "Cliente atualizado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// DELETE /cliente/:id - Deletar cliente
const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do cliente é obrigatório",
      });
    }

    const affectedRows = await ClienteModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cliente deletado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!id || !oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "ID do cliente, senha antiga e nova senha são obrigatórios",
      });
    }

    const cliente = await ClienteModel.findById(id);

    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado",
      });
    }

    const isMatch = await ClienteModel.comparePassword(
      oldPassword,
      cliente.senha
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Senha antiga incorreta",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const affectedRows = await ClienteModel.updatePassword(id, hashedPassword);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Senha atualizada com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  updatePassword,
};
