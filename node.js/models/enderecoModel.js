const { pool } = require("../config/db");

class EnderecoModel {
  // Buscar todos os endereços
  static async findAll() {
    const query = "SELECT * FROM endereco";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar endereços: ${error.message}`);
    }
  }

  // Buscar endereço por ID
  static async findById(id) {
    const query = "SELECT * FROM endereco WHERE id = ?";
    try {
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar endereço: ${error.message}`);
    }
  }

  // Buscar endereços de um cliente
  static async findByCliente(idCliente) {
    const query = "SELECT * FROM endereco WHERE idCliente = ?";
    try {
      const [rows] = await pool.query(query, [idCliente]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar endereços do cliente: ${error.message}`);
    }
  }

  // Buscar endereço de um restaurante
  static async findByRestaurante(idRestaurante) {
    const query = "SELECT * FROM endereco WHERE idRestaurante = ?";
    try {
      const [rows] = await pool.query(query, [idRestaurante]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar endereço do restaurante: ${error.message}`);
    }
  }

  // Criar novo endereço
  static async create(enderecoData) {
    const { idCliente, idRestaurante, logradouro, numero, complemento, bairro, cidade, estado, cep, referencia, tipo } = enderecoData;
    const query = "INSERT INTO endereco (idCliente, idRestaurante, logradouro, numero, complemento, bairro, cidade, estado, cep, referencia, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    try {
      const [result] = await pool.query(query, [idCliente, idRestaurante, logradouro, numero, complemento, bairro, cidade, estado, cep, referencia, tipo]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar endereço: ${error.message}`);
    }
  }

  // Atualizar endereço
  static async update(id, enderecoData) {
    const { logradouro, numero, complemento, bairro, cidade, estado, cep, referencia, tipo } = enderecoData;
    const query = "UPDATE endereco SET logradouro = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, cep = ?, referencia = ?, tipo = ? WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [logradouro, numero, complemento, bairro, cidade, estado, cep, referencia, tipo, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar endereço: ${error.message}`);
    }
  }

  // Deletar endereço
  static async delete(id) {
    const query = "DELETE FROM endereco WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao deletar endereço: ${error.message}`);
    }
  }
}

module.exports = EnderecoModel;
