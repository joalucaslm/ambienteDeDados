const db = require("../config/db");

class PedidoModel {
  // Buscar todos os pedidos
  static async findAll() {
    const query = "SELECT * FROM pedido";
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    }
  }

  // Buscar pedido por ID
  static async findById(idPedido) {
    const query = "SELECT * FROM pedido WHERE idPedido = ?";
    try {
      const [rows] = await db.query(query, [idPedido]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar pedido: ${error.message}`);
    }
  }

  // Buscar pedidos por usuário
  static async findByUsuario(idUsuario) {
    const query = "SELECT * FROM pedido WHERE idUsuario = ?";
    try {
      const [rows] = await db.query(query, [idUsuario]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos do usuário: ${error.message}`);
    }
  }
  /** novo status do pedido.
   * @returns {Promise<number>} O número de linhas afetadas (0 ou 1).
   */
  static async updateStatus(idPedido, status) {
   
    const query = "UPDATE pedido SET status = ? WHERE id = ?";
    
    try {
      // Passamos [status, idPedido] para substituir os '?'
      const [result] = await db.query(query, [status, idPedido]);
      
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
      idCliente, // Lembre-se da divergência idCliente/idUsuario
      status,
      idPagamento,
      precoPedido,
      idEntregador,
      idRestaurante,
      inicioPedido,
      fimPedido,
      idEnderecoCliente,
      itens 
    } = pedidoData;

    // 1. Obter uma conexão do pool (necessário para a transação)
    let connection;
    try {
      connection = await db.getConnection(); 
      await connection.beginTransaction(); 

      
      const pedidoSql = `
        INSERT INTO pedido 
          (idCliente, status, idPagamento, precoPedido, idEntregador, idRestaurante, inicioPedido, fimPedido, idEnderecoCliente)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const pedidoValues = [
        idCliente,
        status || 'Pendente',
        idPagamento,
        precoPedido,
        idEntregador,
        idRestaurante,
        inicioPedido,
        fimPedido,
        idEnderecoCliente
      ];
      
      const [resultPedido] = await connection.query(pedidoSql, pedidoValues);
      const novoPedidoId = resultPedido.insertId; // Pega o ID do pedido que acabou de ser criado

      // 3. Verificar se há itens para inserir
      if (itens && itens.length > 0) {
        
        // 4. Inserir os itens na tabela 'pedido_item'
        const itemSql = `
          INSERT INTO pedido_item (idPedido, idItem, quantidade, precoUnitario) 
          VALUES (?, ?, ?, ?)
        `;

        // Prepara todos os inserts dos itens
        // (Usamos precoUnitario do item, mas o ideal seria buscar do DB)
        for (const item of itens) {
          const itemValues = [
            novoPedidoId, // ID do pedido que criamos
            item.idItem,
            item.quantidade,
            item.precoUnitario // Importante: O front-end deve mandar isso
          ];
          await connection.query(itemSql, itemValues);
        }
      }

      // 5. Se tudo deu certo, "commita" a transação
      await connection.commit();
      return novoPedidoId; // Retorna o ID do novo pedido

    } catch (error) {
      // 6. Se algo deu errado, "desfaz" tudo (rollback)
      if (connection) {
        await connection.rollback();
      }
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    
    } finally {
      // 7. SEMPRE libera a conexão de volta para o pool
      if (connection) {
        connection.release();
      }
    }
  }
}

module.exports = PedidoModel;
