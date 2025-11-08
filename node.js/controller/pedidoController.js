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

module.exports = {
  getPedidos,
  getPedidoById,
  getPedidosByUsuario
};