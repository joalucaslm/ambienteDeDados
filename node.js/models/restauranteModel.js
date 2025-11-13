const { pool } = require("../config/db");

class RestauranteModel {
  // Buscar todos os restaurantes
  static async findAll() {
    const query = "SELECT * FROM restaurante";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar restaurantes: ${error.message}`);
    }
  }

  // Buscar restaurante por ID
  static async findById(id) {
    const query = "SELECT * FROM restaurante WHERE id = ?";
    try {
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar restaurante: ${error.message}`);
    }
  }

  // Buscar restaurante por nome (para evitar duplicação)
  static async findByNome(nome) {
    const query = "SELECT * FROM restaurante WHERE nome = ?";
    try {
      const [rows] = await pool.query(query, [nome]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar restaurante por nome: ${error.message}`);
    }
  }

  // Buscar restaurantes por faixa de preço
  static async findByPreco(preco) {
    const query = "SELECT * FROM restaurante WHERE preco = ?";
    try {
      const [rows] = await pool.query(query, [preco]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar restaurantes por preço: ${error.message}`);
    }
  }

  // Criar novo restaurante
  static async create(restauranteData) {
    const { nome, descricao, telefone, preco } = restauranteData;
    const query = "INSERT INTO restaurante (nome, descricao, telefone, preco) VALUES (?, ?, ?, ?)";
    
    try {
      const [result] = await pool.query(query, [nome, descricao, telefone, preco]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar restaurante: ${error.message}`);
    }
  }

  // Atualizar restaurante
  static async update(id, restauranteData) {
    const { nome, descricao, telefone, preco } = restauranteData;
    const query = "UPDATE restaurante SET nome = ?, descricao = ?, telefone = ?, preco = ? WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [nome, descricao, telefone, preco, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar restaurante: ${error.message}`);
    }
  }

  // Deletar restaurante
  static async delete(id) {
    const query = "DELETE FROM restaurante WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao deletar restaurante: ${error.message}`);
    }
  }
}

module.exports = RestauranteModel;
