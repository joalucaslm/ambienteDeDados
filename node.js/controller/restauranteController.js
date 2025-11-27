// controller/restauranteController.js

const RestauranteModel = require("../models/restauranteModel");

// GET /restaurante - Buscar todos os restaurantes
const getRestaurantes = async (req, res) => {
  try {
    const restaurantes = await RestauranteModel.findAll();
    return res.status(200).json({
      success: true,
      data: restaurantes,
      message: "Lista de restaurantes",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// GET /restaurante/:id - Buscar restaurante por ID
const getRestauranteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID do restaurante é obrigatório",
      });
    }

    const restaurante = await RestauranteModel.findById(id);

    if (!restaurante) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Restaurante não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurante,
      message: "Restaurante recuperado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// GET /restaurante/preco/:preco - Buscar restaurantes por faixa de preço
const getRestaurantesByPreco = async (req, res) => {
  try {
    const { preco } = req.params;

    // Validar preço
    const precoValido = ["$", "$$", "$$$"];
    if (!precoValido.includes(preco)) {
      return res.status(400).json({
        success: false,
        message: `Preço inválido. Use um dos: ${precoValido.join(", ")}`,
      });
    }

    const restaurantes = await RestauranteModel.findByPreco(preco);

    return res.status(200).json({
      success: true,
      data: restaurantes,
      message: `Restaurantes com preço ${preco}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// POST /restaurante - Criar novo restaurante
const createRestaurante = async (req, res) => {
  try {
    const { nome, descricao, telefone, preco } = req.body;

    // Validações básicas
    if (!nome || !descricao) {
      return res.status(400).json({
        success: false,
        message: "Nome e descrição são obrigatórios",
      });
    }

    // Validar preço
    if (preco) {
      const precoValido = ["$", "$$", "$$$"];
      if (!precoValido.includes(preco)) {
        return res.status(400).json({
          success: false,
          message: `Preço inválido. Use um dos: ${precoValido.join(", ")}`,
        });
      }
    }

    // Verificar se restaurante já existe pelo nome
    const restauranteExistente = await RestauranteModel.findByNome(nome);
    if (restauranteExistente) {
      return res.status(409).json({
        success: false,
        message: "Restaurante com este nome já existe",
      });
    }

    const novoRestauranteId = await RestauranteModel.create({
      nome,
      descricao,
      telefone,
      preco,
    });

    return res.status(201).json({
      success: true,
      data: { id: novoRestauranteId },
      message: "Restaurante criado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// PUT /restaurante/:id - Atualizar restaurante
const updateRestaurante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, telefone, preco } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do restaurante é obrigatório",
      });
    }

    // Verificar se restaurante existe
    const restaurante = await RestauranteModel.findById(id);
    if (!restaurante) {
      return res.status(404).json({
        success: false,
        message: "Restaurante não encontrado",
      });
    }

    // Se está mudando o nome, verificar se novo nome já existe
    if (nome && nome !== restaurante.nome) {
      const nomeExistente = await RestauranteModel.findByNome(nome);
      if (nomeExistente) {
        return res.status(409).json({
          success: false,
          message: "Restaurante com este nome já existe",
        });
      }
    }

    // Validar preço se for fornecido
    if (preco) {
      const precoValido = ["$", "$$", "$$$"];
      if (!precoValido.includes(preco)) {
        return res.status(400).json({
          success: false,
          message: `Preço inválido. Use um dos: ${precoValido.join(", ")}`,
        });
      }
    }

    const affectedRows = await RestauranteModel.update(id, {
      nome: nome || restaurante.nome,
      descricao: descricao || restaurante.descricao,
      telefone: telefone || restaurante.telefone,
      preco: preco || restaurante.preco,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurante não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: "Restaurante atualizado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// DELETE /restaurante/:id - Deletar restaurante
const deleteRestaurante = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do restaurante é obrigatório",
      });
    }

    const affectedRows = await RestauranteModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurante não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurante deletado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getPedidosByRestaurante = async (req, res) => {
  try {
    const { id } = req.params;
    const pedidos = await RestauranteModel.findPedidosById(id);
    return res.status(200).json(pedidos);
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// POST /restaurante/tipoCozinha - Criar novo restaurante
const createTipoCozinha = async (req, res) => {
  try {
    const { nome } = req.body;

    // Validações básicas
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: "Nome é obrigatórios",
      });
    }

    const novoTipoCozinha = await RestauranteModel.createCozinha({
      nome,
    });

    return res.status(201).json({
      success: true,
      data: { id: novoTipoCozinha },
      message: "Novo tipo de cozinha criado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const createPagamento = async (req, res) => {
  try {
    const { idRestaurante, idTipoCozinha } = req.body;

    // Validação básica
    if (!idRestaurante || !idTipoCozinha) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos. Todos os campos são obrigatórios.",
      });
    }
    const novoItemId = await RestauranteModel.createRestauranteTipoCozinha({
      idRestaurante,
      idTipoCozinha,
    });

    return res.status(201).json({
      success: true,
      data: { id: novoItemId },
      message: "PedidoItem criado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// POST /restaurante/tipoCozinha - Criar novo restaurante
const createRestauranteTipoCozinha = async (req, res) => {
  try {
    const { idRestaurante, idTipoCozinha } = req.body;

    // Validações básicas
    if (!idRestaurante || !idTipoCozinha) {
      return res.status(400).json({
        success: false,
        message: "IdRestaurante e IdTipoCozinha são obrigatórios",
      });
    }

    const novoTipoCozinha = await RestauranteModel.createRestauranteTipoCozinha({
      idRestaurante,
      idTipoCozinha,
    });

    return res.status(201).json({
      success: true,
      data: { id: novoTipoCozinha },
      message: "Novo tipo de cozinha criado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// GET /restaurante/id:/allInfos - Buscar todos os restaurantes
const getRestauranteInfos = async (req, res) => {
  try {
    const { restauranteId } = req.params;

    const restauranteInfo = await RestauranteModel.restauranteInfoById(restauranteId);

    return res.status(200).json({
      success: true,
      data: restauranteInfo,
      message: `Todas as informações sobre o restaurante com o id:${restauranteId}`,
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
  getRestaurantes,
  getRestauranteById,
  getRestaurantesByPreco,
  createRestaurante,
  updateRestaurante,
  deleteRestaurante,
  getPedidosByRestaurante,
  createTipoCozinha,
  createPagamento,
  createRestauranteTipoCozinha,
  getRestauranteInfos
};
