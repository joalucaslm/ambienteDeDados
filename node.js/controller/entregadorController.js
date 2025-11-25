// controller/entregadorController.js

const EntregadorModel = require("../models/entregadorModel");

// GET /entregador - Buscar todos os entregadores
const getEntregadores = async (req, res) => {
  try {
    const entregadores = await EntregadorModel.findAll();
    return res.status(200).json({
      success: true,
      data: entregadores,
      message: "Lista de entregadores"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /entregador/:id - Buscar entregador por ID
const getEntregadorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID do entregador é obrigatório"
      });
    }

    const entregador = await EntregadorModel.findById(id);
    
    if (!entregador) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Entregador não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: entregador,
      message: "Entregador recuperado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /entregador/status/:status - Buscar entregadores por status
const getEntregadorByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validar status
    const statusValido = ['ativo', 'inativo', 'Em entrega'];
    if (!statusValido.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status inválido. Use um dos: ${statusValido.join(', ')}`
      });
    }

    const entregadores = await EntregadorModel.findByStatus(status);
    
    return res.status(200).json({
      success: true,
      data: entregadores,
      message: `Entregadores com status ${status}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// POST /entregador - Criar novo entregador
const createEntregador = async (req, res) => {
  try {
    const { nome, telefone, cpf, placaMoto, cnh, status } = req.body;

    // Validações básicas
    if (!nome || !telefone || !cpf || !placaMoto || !cnh) {
      return res.status(400).json({
        success: false,
        message: "Nome, telefone, CPF, placa da moto e CNH são obrigatórios"
      });
    }

    // Validar status se fornecido
    if (status) {
      const statusValido = ['ativo', 'inativo', 'Em entrega'];
      if (!statusValido.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status inválido. Use um dos: ${statusValido.join(', ')}`
        });
      }
    }

    // Verificar se CPF já existe
    const cpfExistente = await EntregadorModel.findByCpf(cpf);
    if (cpfExistente) {
      return res.status(409).json({
        success: false,
        message: "CPF já cadastrado"
      });
    }

    const novoEntregadorId = await EntregadorModel.create({ 
      nome, 
      telefone, 
      cpf, 
      placaMoto, 
      cnh,
      status
    });
    
    return res.status(201).json({
      success: true,
      data: { id: novoEntregadorId },
      message: "Entregador criado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// PUT /entregador/:id - Atualizar entregador
const updateEntregador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, telefone, cpf, placaMoto, cnh, status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do entregador é obrigatório"
      });
    }

    // Verificar se entregador existe
    const entregador = await EntregadorModel.findById(id);
    if (!entregador) {
      return res.status(404).json({
        success: false,
        message: "Entregador não encontrado"
      });
    }

    // Se está mudando o CPF, verificar se novo CPF já existe
    if (cpf && cpf !== entregador.cpf) {
      const cpfExistente = await EntregadorModel.findByCpf(cpf);
      if (cpfExistente) {
        return res.status(409).json({
          success: false,
          message: "CPF já cadastrado"
        });
      }
    }

    // Validar status se fornecido
    if (status) {
      const statusValido = ['ativo', 'inativo', 'Em entrega'];
      if (!statusValido.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status inválido. Use um dos: ${statusValido.join(', ')}`
        });
      }
    }

    const affectedRows = await EntregadorModel.update(id, {
      nome: nome || entregador.nome,
      telefone: telefone || entregador.telefone,
      cpf: cpf || entregador.cpf,
      placaMoto: placaMoto || entregador.placaMoto,
      cnh: cnh || entregador.cnh,
      status: status || entregador.status
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Entregador não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: "Entregador atualizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// DELETE /entregador/:id - Deletar entregador
const deleteEntregador = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do entregador é obrigatório"
      });
    }

    const affectedRows = await EntregadorModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Entregador não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Entregador deletado com sucesso!"
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
  getEntregadores,
  getEntregadorById,
  getEntregadorByStatus,
  createEntregador,
  updateEntregador,
  deleteEntregador
};
