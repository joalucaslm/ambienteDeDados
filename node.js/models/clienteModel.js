const { pool } = require("../config/db");

class ClienteModel {
  // Buscar todos os clientes
  static async findAll() {
    const query = "SELECT * FROM cliente";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  // Buscar cliente por ID
  static async findById(id) {
    const query = "SELECT * FROM cliente WHERE id = ?";
    try {
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }
  }

  // Buscar cliente por email
  static async findByEmail(email) {
    const query = "SELECT * FROM cliente WHERE email = ?";
    try {
      const [rows] = await pool.query(query, [email]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar cliente por email: ${error.message}`);
    }
  }

  // Criar novo cliente
  static async create(clienteData) {
    const { nome, email, telefone } = clienteData;
    const query = "INSERT INTO cliente (nome, email, telefone) VALUES (?, ?, ?)";
    
    try {
      const [result] = await pool.query(query, [nome, email, telefone]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }
  }

  // Atualizar cliente
  static async update(id, clienteData) {
    const { nome, email, telefone } = clienteData;
    const query = "UPDATE cliente SET nome = ?, email = ?, telefone = ? WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [nome, email, telefone, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }
  }

  // Deletar cliente
  static async delete(id) {
    const query = "DELETE FROM cliente WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao deletar cliente: ${error.message}`);
    }
  }
}

module.exports = ClienteModel;
