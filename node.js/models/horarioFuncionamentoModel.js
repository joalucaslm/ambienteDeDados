const { pool } = require("../config/db");

class HorarioFuncionamentoModel {
  // Buscar todos os horários
  static async findAll() {
    const query = "SELECT * FROM horario_funcionamento";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar horários: ${error.message}`);
    }
  }

  // Buscar horário por ID
  static async findById(id) {
    const query = "SELECT * FROM horario_funcionamento WHERE id = ?";
    try {
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar horário: ${error.message}`);
    }
  }

  // Buscar horários de um restaurante
  static async findByRestaurante(idRestaurante) {
    const query = "SELECT * FROM horario_funcionamento WHERE idRestaurante = ?";
    try {
      const [rows] = await pool.query(query, [idRestaurante]);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar horários do restaurante: ${error.message}`);
    }
  }

  // Criar novo horário
  static async create(horarioData) {
    const { idRestaurante, diaSemana, horaAbertura, horaFechamento } = horarioData;
    const query = "INSERT INTO horario_funcionamento (idRestaurante, diaSemana, horaAbertura, horaFechamento) VALUES (?, ?, ?, ?)";
    
    try {
      const [result] = await pool.query(query, [idRestaurante, diaSemana, horaAbertura, horaFechamento]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar horário: ${error.message}`);
    }
  }

  // Atualizar horário
  static async update(id, horarioData) {
    const { diaSemana, horaAbertura, horaFechamento } = horarioData;
    const query = "UPDATE horario_funcionamento SET diaSemana = ?, horaAbertura = ?, horaFechamento = ? WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [diaSemana, horaAbertura, horaFechamento, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar horário: ${error.message}`);
    }
  }

  // Deletar horário
  static async delete(id) {
    const query = "DELETE FROM horario_funcionamento WHERE id = ?";
    
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao deletar horário: ${error.message}`);
    }
  }
}

module.exports = HorarioFuncionamentoModel;
