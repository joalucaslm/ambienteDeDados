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
    const { idCliente } = req.query;

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
  // NOTA: O campo 'endereco' do payload não está sendo usado.
  // As colunas 'idPagamento', 'idEntregador', 'idEnderecoCliente' são NOT NULL na tabela
  // e precisam de valores. Usando placeholders (1) por enquanto.
  const { idCliente, idRestaurante, valorTotal, metodoPagamento, itens } = req.body;

  // Validação básica
  if (!idCliente || !idRestaurante || !valorTotal || !metodoPagamento || !itens || itens.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Dados incompletos. Todos os campos são obrigatórios."
    });
  }

  let connection;
  try {
    // 1. Obter uma conexão do pool
    connection = await pool.getConnection();
    
    // 2. Iniciar a transação
    await connection.beginTransaction();

    // 3. Inserir o cabeçalho do pedido na tabela 'pedido'
    // CORREÇÃO: Colunas ajustadas para camelCase (idCliente, idRestaurante, precoPedido)
    // ADIÇÃO: Colunas NOT NULL adicionadas com valores placeholder.
    const pedidoSql = `
      INSERT INTO pedido (idCliente, idRestaurante, precoPedido, status, inicioPedido, idPagamento, idEntregador, idEnderecoCliente, fimPedido) 
      VALUES (?, ?, ?, 'Pendente', NOW(), 1, 1, 1, NOW())
    `;
    // O ideal seria mapear 'metodoPagamento' para um 'idPagamento'
    const [pedidoResult] = await connection.execute(pedidoSql, [idCliente, idRestaurante, valorTotal]);
    const idPedido = pedidoResult.insertId;

    // 4. Preparar os dados dos itens para inserção em lote
    const pedidoItensValues = itens.map(item => [
      idPedido,
      item.idItem,
      item.quantidade,
      item.precoUnitario
    ]);

    // 5. Inserir os itens na tabela 'pedido_item'
    // CORREÇÃO: Colunas ajustadas para camelCase (idPedido, idItem, precoUnitario)
    const itensSql = `
      INSERT INTO pedido_item (idPedido, idItem, quantidade, precoUnitario) 
      VALUES ?
    `;
    await connection.query(itensSql, [pedidoItensValues]);

    // 6. Se tudo deu certo, comitar a transação
    await connection.commit();

    // 7. Enviar a resposta de sucesso
    return res.status(201).json({
      message: "Sucesso",
      idPedido: idPedido
    });

  } catch (error) {
    // 8. Se algo deu errado, reverter a transação
    if (connection) {
      await connection.rollback();
    }
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({
      success: false,
      message: "Erro ao processar o pedido.",
      error: error.message
    });

  } finally {
    // 9. Liberar a conexão de volta para o pool
    if (connection) {
      connection.release();
    }
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

module.exports = {
  getPedidos,
  getPedidoById,
  getPedidosByUsuario,
  createPedido,
  patchPedidoStatus,
  getPedidosByCliente,
};
