"use client"

import { useState } from 'react';
import { Clock, Calendar, Store } from 'lucide-react';

export default function HorarioFuncionamento() {
  const [formData, setFormData] = useState({
    idRestaurante: '',
    diaSemana: '',
    horaAbertura: '',
    horaFechamento: ''
  });

  const diasSemana = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/horario/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Horário cadastrado:', data);
        alert('Horário de funcionamento cadastrado com sucesso!');
        setFormData({
          idRestaurante: '',
          diaSemana: '',
          horaAbertura: '',
          horaFechamento: ''
        });
      } else {
        alert('Erro ao cadastrar horário de funcionamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <article className="bg-gradient-to-br from-orange-50 to-amber-100 w-full min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro de Horário de Funcionamento</h1>
          <p className="text-gray-600 mb-8">Configure os horários de abertura e fechamento</p>

          <div className="space-y-6">
            <div>
              <label htmlFor="idRestaurante" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Store className="w-4 h-4 mr-2 text-orange-600" />
                ID do Restaurante
              </label>
              <input
                type="text"
                id="idRestaurante"
                name="idRestaurante"
                value={formData.idRestaurante}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="ID do restaurante"
              />
            </div>

            <div>
              <label htmlFor="diaSemana" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                Dia da Semana
              </label>
              <select
                id="diaSemana"
                name="diaSemana"
                value={formData.diaSemana}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
              >
                <option value="">Selecione o dia</option>
                {diasSemana.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="horaAbertura" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-orange-600" />
                  Hora de Abertura
                </label>
                <input
                  type="time"
                  id="horaAbertura"
                  name="horaAbertura"
                  value={formData.horaAbertura}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="horaFechamento" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-orange-600" />
                  Hora de Fechamento
                </label>
                <input
                  type="time"
                  id="horaFechamento"
                  name="horaFechamento"
                  value={formData.horaFechamento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Cadastrar Horário de Funcionamento
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}