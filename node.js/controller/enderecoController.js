// controller/enderecoController.js

const EnderecoModel = require("../models/enderecoModel");

// GET /endereco - Buscar todos os endereços
const getEnderecos = async (req, res) => {
  try {
    const enderecos = await EnderecoModel.findAll();
    return res.status(200).json({
      success: true,
      data: enderecos,
      message: "Lista de endereços"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /endereco/:id - Buscar endereço por ID
const getEnderecoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID do endereço é obrigatório"
      });
    }

    const endereco = await EnderecoModel.findById(id);
    
    if (!endereco) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Endereço não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: endereco,
      message: "Endereço recuperado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /cliente/:idCliente/endereco - Buscar endereços de um cliente
const getEnderecosByCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    
    if (!idCliente) {
      return res.status(400).json({
        success: false,
        message: "ID do cliente é obrigatório"
      });
    }

    const enderecos = await EnderecoModel.findByCliente(idCliente);
    
    return res.status(200).json({
      success: true,
      data: enderecos,
      message: `Endereços do cliente ${idCliente}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /restaurante/:idRestaurante/endereco - Buscar endereço de um restaurante
const getEnderecoByRestaurante = async (req, res) => {
  try {
    const { idRestaurante } = req.params;
    
    if (!idRestaurante) {
      return res.status(400).json({
        success: false,
        message: "ID do restaurante é obrigatório"
      });
    }

    const endereco = await EnderecoModel.findByRestaurante(idRestaurante);
    
    return res.status(200).json({
      success: true,
      data: endereco,
      message: `Endereço do restaurante ${idRestaurante}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// POST /endereco - Criar novo endereço
const createEndereco = async (req, res) => {
  try {
    const { idCliente, idRestaurante, logradouro, numero, complemento, bairro, cidade, estado, cep, referencia, tipo } = req.body;

    // Validações
    if (!logradouro || !numero || !bairro || !cidade || !estado || !cep) {
      return res.status(400).json({
        success: false,
        message: "logradouro, numero, bairro, cidade, estado e cep são obrigatórios"
      });
    }

    // Validar tipo se fornecido
    if (tipo) {
      const tiposValidos = ['Residencial', 'Comercial', 'Entrega', 'Cobranca'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
          success: false,
          message: `Tipo inválido. Use um dos: ${tiposValidos.join(', ')}`
        });
      }
    }

    const novoEnderecoId = await EnderecoModel.create({ 
      idCliente: idCliente || null,
      idRestaurante: idRestaurante || null,
      logradouro,
      numero,
      complemento: complemento || null,
      bairro,
      cidade,
      estado,
      cep,
      referencia: referencia || null,
      tipo: tipo || null
    });
    
    return res.status(201).json({
      success: true,
      data: { id: novoEnderecoId },
      message: "Endereço criado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// PUT /endereco/:id - Atualizar endereço
const updateEndereco = async (req, res) => {
  try {
    const { id } = req.params;
    const { logradouro, numero, complemento, bairro, cidade, estado, cep, referencia, tipo } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do endereço é obrigatório"
      });
    }

    // Verificar se endereço existe
    const endereco = await EnderecoModel.findById(id);
    if (!endereco) {
      return res.status(404).json({
        success: false,
        message: "Endereço não encontrado"
      });
    }

    // Validar tipo se fornecido
    if (tipo) {
      const tiposValidos = ['Residencial', 'Comercial', 'Entrega', 'Cobranca'];
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
          success: false,
          message: `Tipo inválido. Use um dos: ${tiposValidos.join(', ')}`
        });
      }
    }

    const affectedRows = await EnderecoModel.update(id, {
      logradouro: logradouro || endereco.logradouro,
      numero: numero || endereco.numero,
      complemento: complemento || endereco.complemento,
      bairro: bairro || endereco.bairro,
      cidade: cidade || endereco.cidade,
      estado: estado || endereco.estado,
      cep: cep || endereco.cep,
      referencia: referencia || endereco.referencia,
      tipo: tipo || endereco.tipo
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Endereço não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: "Endereço atualizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// DELETE /endereco/:id - Deletar endereço
const deleteEndereco = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do endereço é obrigatório"
      });
    }

    const affectedRows = await EnderecoModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Endereço não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Endereço deletado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

module.exports = {
  getEnderecos,
  getEnderecoById,
  getEnderecosByCliente,
  getEnderecoByRestaurante,
  createEndereco,
  updateEndereco,
  deleteEndereco
};
