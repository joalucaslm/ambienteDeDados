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
}

module.exports = PedidoModel;
