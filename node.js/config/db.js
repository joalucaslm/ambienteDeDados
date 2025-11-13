const mysql = require('mysql2/promise');
require("dotenv").config(); // Carrega as variáveis de ambiente

// Cria o Pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Função simples para testar a conexão
async function testConnection() {
    try {
        console.log("Tentando conectar ao MySQL...");
        const connection = await pool.getConnection();
        console.log("✅ Conexão ao MySQL estabelecida com sucesso!");
        connection.release(); // Libera a conexão
    } catch (error) {
        console.error("❌ Erro ao conectar ao MySQL:", error.message);
    }
}

// Exporta o pool (para os Models) e a função de teste (para o index.js)
module.exports = {
    pool,
    testConnection
};