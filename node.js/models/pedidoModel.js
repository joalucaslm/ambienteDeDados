const { pool } = require("../config/db");

class PedidoModel {
  // Buscar todos os pedidos
  static async findAll() {
    const query = "SELECT * FROM pedido";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    }
  }

  // Buscar pedido por ID
  static async findById(idPedido) {
    const query = "SELECT * FROM pedido WHERE idPedido = ?";
    try {
      const [rows] = await pool.query(query, [idPedido]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar pedido: ${error.message}`);
    }
  }

  // Buscar pedidos por usuário
  static async findByUsuario(idUsuario) {
    const query = "SELECT * FROM pedido WHERE idUsuario = ?";
    try {
      const [rows] = await pool.query(query, [idUsuario]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos do usuário: ${error.message}`);
    }
  }

  static async findByClienteId(idCliente) {
    const query = `
      SELECT
        p.idPedido AS id,
        r.nome AS nomeRestaurante,
        r.urlFoto AS fotoRestaurante,
        p.inicioPedido AS dataPedido,
        p.status,
        p.precoPedido AS valorTotal
      FROM pedido AS p
      JOIN restaurante AS r ON p.idRestaurante = r.idRestaurante
      WHERE p.idCliente = ?
      ORDER BY p.inicioPedido DESC;
    `;
    try {
      const [rows] = await pool.query(query, [idCliente]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos do cliente: ${error.message}`);
    }
  }

  /** novo status do pedido.
   * @returns {Promise<number>} O número de linhas afetadas (0 ou 1).
   */
  static async updateStatus(idPedido, status) {
    const query = "UPDATE pedido SET status = ? WHERE idPedido = ?";

    try {
      // Passamos [status, idPedido] para substituir os '?'
      const [result] = await pool.query(query, [status, idPedido]);

      // Retorna o número de linhas que foram de fato atualizadas
      // Se for 0, significa que o 'idPedido' não foi encontrado.
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar status do pedido: ${error.message}`);
    }
  }
  /**
   * Cria um novo pedido e seus itens usando uma transação.
   * @param {Object} pedidoData - Contém os dados do pedido e um array de itens.
   * Ex: { idCliente: 1, idRestaurante: 2, ..., itens: [{ idItem: 5, quantidade: 2 }, ...] }
   */

  static async create(pedidoData) {
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
      idEnderecoCliente,
    } = pedidoData;

    // Query correta com 11 colunas e 11 placeholders
    const query = `
    INSERT INTO pedido 
      (idCliente, status, idPagamento, avaliacao, estrelas, precoPedido, idEntregador, idRestaurante, inicioPedido, fimPedido, idEnderecoCliente)
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    // Valores na ordem EXATA da query
    const values = [
      idCliente,
      status,
      idPagamento,
      avaliacao ?? null,
      estrelas ?? null,
      precoPedido,
      idEntregador ?? null,
      idRestaurante,
      inicioPedido,
      fimPedido ?? null,
      idEnderecoCliente,
    ];

    try {
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    }
  }

  static async createPedidoItem(pedidoItemData) {
    const { idPedido, idItem, quantidade, precoUnitario } = pedidoItemData;
    const query =
      "INSERT INTO pedido_item (idPedido, idItem, quantidade, precoUnitario) VALUES (?, ?, ?, ?)";

    try {
      const [result] = await pool.query(query, [
        idPedido,
        idItem,
        quantidade,
        precoUnitario,
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar item: ${error.message}`);
    }
  }

  // Evita o problema de SQL INJECTION
  static async pedidoInfoById(pedidoId) {
    const query = `
   SELECT 
    p.id,
    clnt.nome AS nomeCliente,
    p.status,
    pag.nome AS metodoPagamento,
    p.avaliacao,
    p.estrelas,
    p.precoPedido,
    entr.nome AS entregador,
    rest.nome AS restaurante,
    p.inicioPedido,
    p.fimPedido,
    CONCAT_WS(', ', 
        end.logradouro, 
        end.numero, 
        end.complemento, 
        end.bairro, 
        end.cidade, 
        end.estado, 
        end.cep
    ) AS enderecoCompleto,
    end.referencia AS referenciaEndereco
FROM pedido p
INNER JOIN cliente clnt ON p.idCliente = clnt.id
INNER JOIN pagamento pag ON p.idPagamento = pag.id
INNER JOIN entregador entr ON p.idEntregador = entr.id
INNER JOIN restaurante rest ON p.idRestaurante = rest.id
INNER JOIN endereco end ON p.idEnderecoCliente = end.id
WHERE p.id = ?;
  `;

    try {
      const [rows] = await pool.query(query, [pedidoId]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar restaurante: ${error.message}`);
    }
  }
}

module.exports = PedidoModel;
