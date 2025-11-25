const { pool } = require("../config/db");
const PedidoModel = require("../models/pedidoModel");

// GET /pedido - Buscar todos os pedidos
const getPedidos = async (req, res) => {
  try {
    const pedidos = await PedidoModel.findAll();
    
    return res.status(200).json({
      success: true,
      data: pedidos,
      message: "Lista de pedidos "
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /pedido/:idPedido - Buscar pedido por ID
const getPedidoById = async (req, res) => {
  try {
    const { idPedido } = req.params;
    
    if (!idPedido) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID do pedido é obrigatório"
      });
    }

    const pedido = await PedidoModel.findById(idPedido);
    
    if (!pedido) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Pedido não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: pedido,
      message: "Pedido recuperado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /pedido/usuario/:idUsuario - Buscar pedidos por usuário
const getPedidosByUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;
    
    const pedidos = await PedidoModel.findByUsuario(idUsuario);
    
    return res.status(200).json({
      success: true,
      data: pedidos,
      message: "Pedidos do usuário recuperados com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

const getPedidosByCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;

    if (!idCliente) {
      return res.status(400).json({
        success: false,
        message: "O parâmetro 'idCliente' é obrigatório.",
      });
    }

    const pedidos = await PedidoModel.findByClienteId(idCliente);

    return res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos do cliente:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      error: error.message,
    });
  }
};

// POST /pedido - Criar um novo pedido com transação
const createPedido = async (req, res) => {
  try {
    const { 
      idCliente, 
      status, 
      idPagamento, 
      avaliacao, 
      estrelas, 
      precoPedido, 
      idEntregador, 
      idRestaurante, 
      inicioPedido, 
      fimPedido, 
      idEnderecoCliente 
    } = req.body;

     const requiredFields = {
      idCliente: "O parâmetro 'idCliente' é obrigatório.",
      status: "O parâmetro 'status' é obrigatório.",
      idPagamento: "O parâmetro 'idPagamento' é obrigatório.",
      precoPedido: "O parâmetro 'precoPedido' é obrigatório.",
      idRestaurante: "O parâmetro 'idRestaurante' é obrigatório.",
      inicioPedido: "O parâmetro 'inicioPedido' é obrigatório.",
      idEnderecoCliente: "O parâmetro 'idEnderecoCliente' é obrigatório."
    };

    // Validação automática
    for (const field in requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: requiredFields[field]
        });
      }
    }

    // Criar o pedido no Model
    const novoPedidoId = await PedidoModel.create({
      idCliente,
      status,
      idPagamento,
      avaliacao,
      estrelas,
      precoPedido,
      idEntregador,
      idRestaurante,
      inicioPedido,
      fimPedido,
      idEnderecoCliente
    });

    return res.status(201).json({
      success: true,
      data: { id: novoPedidoId },
      message: "Pedido criado com sucesso!"
    });

  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
      error: error.message,
    });
  }
};


// PATCH /pedido/:idPedido/status - Atualizar status
const patchPedidoStatus = async (req, res) => {
  try {
    const { idPedido } = req.params;
    const { status } = req.body; 

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "O novo 'status' é obrigatório no corpo (body) da requisição."
      });
    }

    const validStatus = ['Pendente', 'Em preparo', 'Saiu para entrega', 'Entregue', 'Cancelado'];
    if (!validStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Status inválido. Use um dos: ${validStatus.join(', ')}`
        });
    }

    const affectedRows = await PedidoModel.updateStatus(idPedido, status);
    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Pedido não encontrado com o ID fornecido."
      });
    }

    return res.status(200).json({
      success: true,
      data: { id: idPedido, newStatus: status },
      message: "Status do pedido atualizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

const createPedidoItem = async (req, res) => {
  try {
    const { idPedido, idItem, quantidade, precoUnitario } = req.body;

    // Validação básica
    if (!idPedido || !idItem || !quantidade || !precoUnitario) {
      return res.status(400).json({
        success: false,
        message: "Dados incompletos. Todos os campos são obrigatórios."
      });
    }
    const novoItemId = await PedidoModel.createPedidoItem({
      idPedido,
      idItem,
      quantidade,
      precoUnitario
    });

    return res.status(201).json({
      success: true,
      data: { id: novoItemId },
      message: "PedidoItem criado com sucesso!"
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
  getPedidos,
  getPedidoById,
  getPedidosByUsuario,
  createPedido,
  patchPedidoStatus,
  getPedidosByCliente,
  createPedidoItem,
};
