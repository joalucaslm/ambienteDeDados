const { pool } = require("../config/db");

class EntregadorModel {
  // Buscar todos os entregadores
  static async findAll() {
    const query = "SELECT * FROM entregador";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar entregadores: ${error.message}`);
    }
  }

  // Buscar entregador por ID
  static async findById(id) {
    const query = "SELECT * FROM entregador WHERE id = ?";
    try {
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar entregador: ${error.message}`);
    }
  }

  // Buscar entregadores por status
  static async findByStatus(status) {
    const query = "SELECT * FROM entregador WHERE status = ?";
    try {
      const [rows] = await pool.query(query, [status]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar entregadores por status: ${error.message}`);
    }
  }

  // Buscar entregador por CPF
  static async findByCpf(cpf) {
    const query = "SELECT * FROM entregador WHERE cpf = ?";
    try {
      const [rows] = await pool.query(query, [cpf]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar entregador por CPF: ${error.message}`);
    }
  }

  // Criar novo entregador
  static async create(entregadorData) {
    const { nome, telefone, cpf, placaMoto, cnh, status } = entregadorData;
    const query = "INSERT INTO entregador (nome, telefone, cpf, placaMoto, cnh, status) VALUES (?, ?, ?, ?, ?, ?)";
    
    try {
      const [result] = await pool.query(query, [nome, telefone, cpf, placaMoto, cnh, status || 'inativo']);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar entregador: ${error.message}`);
    }
  }

  // Atualizar entregador
  static async update(id, entregadorData) {
    const { nome, telefone, cpf, placaMoto, cnh, status } = entregadorData;
    const query = "UPDATE entregador SET nome = ?, telefone = ?, cpf = ?, placaMoto = ?, cnh = ?, status = ? WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [nome, telefone, cpf, placaMoto, cnh, status, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar entregador: ${error.message}`);
    }
  }

  // Deletar entregador
  static async delete(id) {
    const query = "DELETE FROM entregador WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao deletar entregador: ${error.message}`);
    }
  }
}

module.exports = EntregadorModel;
