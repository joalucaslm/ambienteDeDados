// controller/pagamentoController.js

const PagamentoModel = require("../models/pagamentoModel");

// GET /pagamento - Buscar todos os pagamentos
const getPagamentos = async (req, res) => {
  try {
    const pagamentos = await PagamentoModel.findAll();
    return res.status(200).json({
      success: true,
      data: pagamentos,
      message: "Lista de pagamentos"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /pagamento/:id - Buscar pagamento por ID
const getPagamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID do pagamento é obrigatório"
      });
    }

    const pagamento = await PagamentoModel.findById(id);
    
    if (!pagamento) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Pagamento não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: pagamento,
      message: "Pagamento recuperado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// POST /pagamento - Criar novo pagamento
const createPagamento = async (req, res) => {
  try {
    const { nome } = req.body;

    // Validações básicas
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: "Nome do pagamento é obrigatório"
      });
    }

    // Verificar se pagamento já existe
    const pagamentoExistente = await PagamentoModel.findByNome(nome);
    if (pagamentoExistente) {
      return res.status(409).json({
        success: false,
        message: "Pagamento com este nome já existe"
      });
    }

    const novoPagamentoId = await PagamentoModel.create({ nome });
    
    return res.status(201).json({
      success: true,
      data: { id: novoPagamentoId },
      message: "Pagamento criado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// PUT /pagamento/:id - Atualizar pagamento
const updatePagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do pagamento é obrigatório"
      });
    }

    // Verificar se pagamento existe
    const pagamento = await PagamentoModel.findById(id);
    if (!pagamento) {
      return res.status(404).json({
        success: false,
        message: "Pagamento não encontrado"
      });
    }

    // Se está mudando o nome, verificar se novo nome já existe
    if (nome && nome !== pagamento.nome) {
      const nomeExistente = await PagamentoModel.findByNome(nome);
      if (nomeExistente) {
        return res.status(409).json({
          success: false,
          message: "Pagamento com este nome já existe"
        });
      }
    }

    const affectedRows = await PagamentoModel.update(id, {
      nome: nome || pagamento.nome
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pagamento não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: "Pagamento atualizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// DELETE /pagamento/:id - Deletar pagamento
const deletePagamento = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do pagamento é obrigatório"
      });
    }

    const affectedRows = await PagamentoModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Pagamento não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pagamento deletado com sucesso!"
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
  getPagamentos,
  getPagamentoById,
  createPagamento,
  updatePagamento,
  deletePagamento
};
