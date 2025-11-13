const { pool } = require("../config/db");

class PagamentoModel {
  // Buscar todos os pagamentos
  static async findAll() {
    const query = "SELECT * FROM pagamento";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar pagamentos: ${error.message}`);
    }
  }

  // Buscar pagamento por ID
  static async findById(id) {
    const query = "SELECT * FROM pagamento WHERE id = ?";
    try {
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar pagamento: ${error.message}`);
    }
  }

  // Buscar pagamento por nome
  static async findByNome(nome) {
    const query = "SELECT * FROM pagamento WHERE nome = ?";
    try {
      const [rows] = await pool.query(query, [nome]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar pagamento por nome: ${error.message}`);
    }
  }

  // Criar novo pagamento
  static async create(pagamentoData) {
    const { nome } = pagamentoData;
    const query = "INSERT INTO pagamento (nome) VALUES (?)";
    
    try {
      const [result] = await pool.query(query, [nome]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar pagamento: ${error.message}`);
    }
  }

  // Atualizar pagamento
  static async update(id, pagamentoData) {
    const { nome } = pagamentoData;
    const query = "UPDATE pagamento SET nome = ? WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [nome, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar pagamento: ${error.message}`);
    }
  }

  // Deletar pagamento
  static async delete(id) {
    const query = "DELETE FROM pagamento WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao deletar pagamento: ${error.message}`);
    }
  }
}

module.exports = PagamentoModel;
