// controller/itemController.js

const ItemModel = require("../models/itemModel");

// GET /item - Buscar todos os itens
const getItens = async (req, res) => {
  try {
    const itens = await ItemModel.findAll();
    return res.status(200).json({
      success: true,
      data: itens,
      message: "Lista de itens"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /item/:id - Buscar item por ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID do item é obrigatório"
      });
    }

    const item = await ItemModel.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Item não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
      message: "Item recuperado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /restaurante/:idRestaurante/itens - Buscar itens de um restaurante
const getItensByRestaurante = async (req, res) => {
  try {
    const { idRestaurante } = req.params;
    
    if (!idRestaurante) {
      return res.status(400).json({
        success: false,
        message: "ID do restaurante é obrigatório"
      });
    }

    const itens = await ItemModel.findByRestaurante(idRestaurante);
    
    return res.status(200).json({
      success: true,
      data: itens,
      message: `Itens do restaurante ${idRestaurante}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /item/tipo/:idTipo - Buscar itens por tipo
const getItensByTipo = async (req, res) => {
  try {
    const { idTipo } = req.params;
    
    if (!idTipo) {
      return res.status(400).json({
        success: false,
        message: "ID do tipo é obrigatório"
      });
    }

    const itens = await ItemModel.findByTipo(idTipo);
    
    return res.status(200).json({
      success: true,
      data: itens,
      message: `Itens do tipo ${idTipo}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// POST /item - Criar novo item
const createItem = async (req, res) => {
  try {
    const { idRestaurante, nome, descricao, idTipo, preco } = req.body;

    // Validações básicas
    if (!idRestaurante || !nome || !descricao || !idTipo || !preco) {
      return res.status(400).json({
        success: false,
        message: "idRestaurante, nome, descrição, idTipo e preço são obrigatórios"
      });
    }

    const novoItemId = await ItemModel.create({ 
      idRestaurante,
      nome, 
      descricao, 
      idTipo,
      preco
    });
    
    return res.status(201).json({
      success: true,
      data: { id: novoItemId },
      message: "Item criado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// PUT /item/:id - Atualizar item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, idTipo, preco } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do item é obrigatório"
      });
    }

    // Verificar se item existe
    const item = await ItemModel.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item não encontrado"
      });
    }

    const affectedRows = await ItemModel.update(id, {
      nome: nome || item.nome,
      descricao: descricao || item.descricao,
      idTipo: idTipo || item.idTipo,
      preco: preco || item.preco
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Item não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: "Item atualizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// DELETE /item/:id - Deletar item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do item é obrigatório"
      });
    }

    const affectedRows = await ItemModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Item não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deletado com sucesso!"
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
  getItens,
  getItemById,
  getItensByRestaurante,
  getItensByTipo,
  createItem,
  updateItem,
  deleteItem
};
