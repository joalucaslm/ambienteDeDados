// controller/horarioFuncionamentoController.js

const HorarioFuncionamentoModel = require("../models/horarioFuncionamentoModel");

// GET /horario - Buscar todos os horários
const getHorarios = async (req, res) => {
  try {
    const horarios = await HorarioFuncionamentoModel.findAll();
    return res.status(200).json({
      success: true,
      data: horarios,
      message: "Lista de horários de funcionamento"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /horario/:id - Buscar horário por ID
const getHorarioById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "ID do horário é obrigatório"
      });
    }

    const horario = await HorarioFuncionamentoModel.findById(id);
    
    if (!horario) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Horário não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: horario,
      message: "Horário recuperado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// GET /restaurante/:idRestaurante/horarios - Buscar horários de um restaurante
const getHorariosByRestaurante = async (req, res) => {
  try {
    const { idRestaurante } = req.params;
    
    if (!idRestaurante) {
      return res.status(400).json({
        success: false,
        message: "ID do restaurante é obrigatório"
      });
    }

    const horarios = await HorarioFuncionamentoModel.findByRestaurante(idRestaurante);
    
    return res.status(200).json({
      success: true,
      data: horarios,
      message: `Horários do restaurante ${idRestaurante}`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// POST /horario - Criar novo horário
const createHorario = async (req, res) => {
  try {
    const { idRestaurante, diaSemana, horaAbertura, horaFechamento } = req.body;

    // Validações
    if (!idRestaurante || !diaSemana || !horaAbertura || !horaFechamento) {
      return res.status(400).json({
        success: false,
        message: "idRestaurante, diaSemana, horaAbertura e horaFechamento são obrigatórios"
      });
    }

    // Validar dias da semana
    const diasValidos = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    if (!diasValidos.includes(diaSemana)) {
      return res.status(400).json({
        success: false,
        message: `Dia inválido. Use um dos: ${diasValidos.join(', ')}`
      });
    }

    const novoHorarioId = await HorarioFuncionamentoModel.create({ 
      idRestaurante,
      diaSemana,
      horaAbertura,
      horaFechamento
    });
    
    return res.status(201).json({
      success: true,
      data: { id: novoHorarioId },
      message: "Horário criado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// PUT /horario/:id - Atualizar horário
const updateHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { diaSemana, horaAbertura, horaFechamento } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do horário é obrigatório"
      });
    }

    // Verificar se horário existe
    const horario = await HorarioFuncionamentoModel.findById(id);
    if (!horario) {
      return res.status(404).json({
        success: false,
        message: "Horário não encontrado"
      });
    }

    // Validar dia se fornecido
    if (diaSemana) {
      const diasValidos = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      if (!diasValidos.includes(diaSemana)) {
        return res.status(400).json({
          success: false,
          message: `Dia inválido. Use um dos: ${diasValidos.join(', ')}`
        });
      }
    }

    const affectedRows = await HorarioFuncionamentoModel.update(id, {
      diaSemana: diaSemana || horario.diaSemana,
      horaAbertura: horaAbertura || horario.horaAbertura,
      horaFechamento: horaFechamento || horario.horaFechamento
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Horário não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: { id },
      message: "Horário atualizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// DELETE /horario/:id - Deletar horário
const deleteHorario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID do horário é obrigatório"
      });
    }

    const affectedRows = await HorarioFuncionamentoModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Horário não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Horário deletado com sucesso!"
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
  getHorarios,
  getHorarioById,
  getHorariosByRestaurante,
  createHorario,
  updateHorario,
  deleteHorario
};
