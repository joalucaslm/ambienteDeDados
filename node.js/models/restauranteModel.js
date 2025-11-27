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
      throw new Error(
        `Erro ao buscar restaurantes por preço: ${error.message}`
      );
    }
  }

  // Criar novo restaurante
  static async create(restauranteData) {
    const { nome, descricao, telefone, preco } = restauranteData;
    const query =
      "INSERT INTO restaurante (nome, descricao, telefone, preco) VALUES (?, ?, ?, ?)";

    try {
      const [result] = await pool.query(query, [
        nome,
        descricao,
        telefone,
        preco,
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar restaurante: ${error.message}`);
    }
  }

  // Atualizar restaurante
  static async update(id, restauranteData) {
    const { nome, descricao, telefone, preco } = restauranteData;
    const query =
      "UPDATE restaurante SET nome = ?, descricao = ?, telefone = ?, preco = ? WHERE id = ?";

    try {
      const [result] = await pool.query(query, [
        nome,
        descricao,
        telefone,
        preco,
        id,
      ]);
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

  static async findPedidosById(idRestaurante) {
    const query = `
      SELECT
        p.idPedido AS id,
        p.status,
        c.nome AS nomeCliente,
        i.nome AS nomeItem,
        pi.quantidade,
        pi.precoUnitario,
        p.observacoes
      FROM pedido AS p
      JOIN cliente AS c ON p.idCliente = c.idCliente
      LEFT JOIN pedido_item AS pi ON p.idPedido = pi.idPedido
      LEFT JOIN item AS i ON pi.idItem = i.idItem
      WHERE p.idRestaurante = ?
      ORDER BY p.inicioPedido DESC;
    `;
    try {
      const [rows] = await pool.query(query, [idRestaurante]);

      // Agrupar itens por pedido
      const pedidos = {};
      rows.forEach((row) => {
        if (!pedidos[row.id]) {
          pedidos[row.id] = {
            id: row.id,
            status: row.status,
            nomeCliente: row.nomeCliente,
            observacoes: row.observacoes,
            itens: [],
          };
        }
        if (row.nomeItem) {
          pedidos[row.id].itens.push({
            nomeItem: row.nomeItem,
            quantidade: row.quantidade,
            precoUnitario: row.precoUnitario,
          });
        }
      });

      return Object.values(pedidos);
    } catch (error) {
      throw new Error(
        `Erro ao buscar pedidos do restaurante: ${error.message}`
      );
    }
  }

  // Criar novo tipo cozinha
  static async createCozinha(tipoCozinhaData) {
    const { nome } = tipoCozinhaData;
    const query = "INSERT INTO tipo_cozinha (nome) VALUES (?)";

    try {
      const [result] = await pool.query(query, [nome]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar restaurante: ${error.message}`);
    }
  }

  // Criar novo restaurante pagamento
  static async createPagamento(restaurantePagamentoData) {
    const { idRestaurante, idPagamento } = restaurantePagamentoData;
    const query =
      "INSERT INTO restaurante_pagamento (idRestaurante, idPagamento) VALUES (?, ?)";

    try {
      const [result] = await pool.query(query, [idRestaurante, idPagamento]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar restaurante: ${error.message}`);
    }
  }

  // Criar novo tipo cozinha
  static async createRestauranteTipoCozinha(restauranteTipoCozinhaData) {
    const { idRestaurante, idTipoCozinha } = restauranteTipoCozinhaData;
    const query =
      "INSERT INTO restaurante_tipo_cozinha (idRestaurante, idTipoCozinha) VALUES (?, ?)";

    try {
      const [result] = await pool.query(query, [idRestaurante, idTipoCozinha]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar restaurante: ${error.message}`);
    }
  }

  // Evita o problema de SQL INJECTION
  static async restauranteInfoById(restauranteId) {
    const query = `
    SELECT 
        r.*,
        GROUP_CONCAT(DISTINCT p.nome ORDER BY p.nome SEPARATOR ', ') AS formas_pagamento,
        GROUP_CONCAT(DISTINCT tc.nome ORDER BY tc.nome SEPARATOR ', ') AS tipos_cozinha,
        GROUP_CONCAT(
            DISTINCT CONCAT(
                hf.diaSemana, ': ',
                hf.horaAbertura, ' - ',
                hf.horaFechamento
            )
            ORDER BY hf.diaSemana
            SEPARATOR ' | '
        ) AS horarios_funcionamento
    FROM restaurante r
    LEFT JOIN restaurante_pagamento rp 
        ON r.id = rp.idRestaurante
    LEFT JOIN pagamento p 
        ON rp.idPagamento = p.id
    LEFT JOIN restaurante_tipo_cozinha rtc 
        ON r.id = rtc.idRestaurante
    LEFT JOIN tipo_cozinha tc 
        ON rtc.idTipoCozinha = tc.id
    LEFT JOIN horario_funcionamento hf 
        ON r.id = hf.idRestaurante
    WHERE r.id = ?
    GROUP BY r.id
    ORDER BY r.id;
  `;

    try {
      const [rows] = await pool.query(query, [restauranteId]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar restaurante: ${error.message}`);
    }
  }
}

module.exports = RestauranteModel;
