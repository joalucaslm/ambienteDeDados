const pool = require('../config/db');

const LoginModel = {
  // Buscar por username
  findByUsername: async (username) => {
    const query = 'SELECT * FROM login WHERE username = ?';
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
  },

  // Criar novo usuário
  create: async (userData) => {
    const query = 'INSERT INTO login (username, password) VALUES (?, ?)';
    const [result] = await pool.execute(query, [
      userData.username,
      userData.password
    ]);
    return result.insertId;
  },

  // Buscar por ID
  findById: async (id) => {
    const query = 'SELECT idLogin, username FROM login WHERE idLogin = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }
};

module.exports = LoginModel;