const { pool } = require("../config/db");

class ItemModel {
  // Buscar todos os itens
  static async findAll() {
    const query = "SELECT * FROM item";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar itens: ${error.message}`);
    }
  }

  // Buscar item por ID
  static async findById(id) {
    const query = "SELECT * FROM item WHERE id = ?";
    try {
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar item: ${error.message}`);
    }
  }

  // Buscar itens por restaurante
  static async findByRestaurante(idRestaurante) {
    const query = "SELECT * FROM item WHERE idRestaurante = ?";
    try {
      const [rows] = await pool.query(query, [idRestaurante]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar itens do restaurante: ${error.message}`);
    }
  }

  // Buscar itens por tipo
  static async findByTipo(idTipo) {
    const query = "SELECT * FROM item WHERE idTipo = ?";
    try {
      const [rows] = await pool.query(query, [idTipo]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar itens por tipo: ${error.message}`);
    }
  }

  // Criar novo item
  static async create(itemData) {
    const { idRestaurante, nome, descricao, idTipo, preco } = itemData;
    const query = "INSERT INTO item (idRestaurante, nome, descricao, idTipo, preco) VALUES (?, ?, ?, ?, ?)";
    
    try {
      const [result] = await pool.query(query, [idRestaurante, nome, descricao, idTipo, preco]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar item: ${error.message}`);
    }
  }

  // Atualizar item
  static async update(id, itemData) {
    const { nome, descricao, idTipo, preco } = itemData;
    const query = "UPDATE item SET nome = ?, descricao = ?, idTipo = ?, preco = ? WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [nome, descricao, idTipo, preco, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar item: ${error.message}`);
    }
  }

  // Deletar item
  static async delete(id) {
    const query = "DELETE FROM item WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao deletar item: ${error.message}`);
    }
  }

   // Criar novo tipo item
  static async createTipoItem(tipoItemData) {
    const { nome } = tipoItemData;
    const query = "INSERT INTO tipo_item (nome) VALUES (?)";
    
    try {
      const [result] = await pool.query(query, [nome]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar item: ${error.message}`);
    }
  }
}

module.exports = ItemModel;
