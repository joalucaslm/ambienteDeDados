"use client"

import { useState } from 'react';
import { User, CheckCircle, CreditCard, Star, DollarSign, Bike, Store, Clock, MapPin, MessageSquare } from 'lucide-react';

export default function Pedido() {
  const [formData, setFormData] = useState({
    idCliente: '',
    status: 'Pendente',
    idPagamento: '',
    avaliacao: '',
    estrelas: '',
    precoPedido: '',
    idEntregador: '',
    idRestaurante: '',
    inicioPedido: '',
    fimPedido: '',
    idEnderecoCliente: ''
  });

  const statusOptions = [
    'Pendente',
    'Confirmado',
    'Em Preparo',
    'Pronto',
    'Em Entrega',
    'Entregue',
    'Cancelado'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (dateTimeLocal) => {
    if (!dateTimeLocal) return null;
    // Converte de "2025-11-26T05:27" para "2025-11-26 05:27:00"
    return dateTimeLocal.replace('T', ' ') + ':00';
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/pedido/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          estrelas: formData.estrelas ? parseInt(formData.estrelas) : null,
          precoPedido: parseFloat(formData.precoPedido),
          inicioPedido: formatDateTime(formData.inicioPedido),
          fimPedido: formatDateTime(formData.fimPedido)
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Pedido cadastrado:', data);
        alert('Pedido cadastrado com sucesso!');
        setFormData({
          idCliente: '',
          status: 'Pendente',
          idPagamento: '',
          avaliacao: '',
          estrelas: '',
          precoPedido: '',
          idEntregador: '',
          idRestaurante: '',
          inicioPedido: '',
          fimPedido: '',
          idEnderecoCliente: ''
        });
      } else {
        alert('Erro ao cadastrar pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <article className="bg-gradient-to-br from-violet-50 to-purple-100 w-full min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro de Pedido</h1>
          <p className="text-gray-600 mb-8">Crie um novo pedido no sistema</p>

          <div className="space-y-6">
            {/* Linha 1: Cliente, Status, Pagamento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="idCliente" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-violet-600" />
                  ID Cliente
                </label>
                <input
                  type="text"
                  id="idCliente"
                  name="idCliente"
                  value={formData.idCliente}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="ID do cliente"
                />
              </div>

              <div>
                <label htmlFor="status" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CheckCircle className="w-4 h-4 mr-2 text-violet-600" />
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition bg-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="idPagamento" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 mr-2 text-violet-600" />
                  ID Pagamento
                </label>
                <input
                  type="text"
                  id="idPagamento"
                  name="idPagamento"
                  value={formData.idPagamento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="ID do pagamento"
                />
              </div>
            </div>

            {/* Linha 2: Restaurante, Entregador, Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="idRestaurante" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Store className="w-4 h-4 mr-2 text-violet-600" />
                  ID Restaurante
                </label>
                <input
                  type="text"
                  id="idRestaurante"
                  name="idRestaurante"
                  value={formData.idRestaurante}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="ID do restaurante"
                />
              </div>

              <div>
                <label htmlFor="idEntregador" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Bike className="w-4 h-4 mr-2 text-violet-600" />
                  ID Entregador
                </label>
                <input
                  type="text"
                  id="idEntregador"
                  name="idEntregador"
                  value={formData.idEntregador}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="ID do entregador"
                />
              </div>

              <div>
                <label htmlFor="idEnderecoCliente" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-violet-600" />
                  ID Endereço
                </label>
                <input
                  type="text"
                  id="idEnderecoCliente"
                  name="idEnderecoCliente"
                  value={formData.idEnderecoCliente}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="ID do endereço"
                />
              </div>
            </div>

            {/* Linha 3: Horários e Preço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="inicioPedido" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-violet-600" />
                  Início do Pedido
                </label>
                <input
                  type="datetime-local"
                  id="inicioPedido"
                  name="inicioPedido"
                  value={formData.inicioPedido}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="fimPedido" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-violet-600" />
                  Fim do Pedido
                </label>
                <input
                  type="datetime-local"
                  id="fimPedido"
                  name="fimPedido"
                  value={formData.fimPedido}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="precoPedido" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2 text-violet-600" />
                  Preço do Pedido
                </label>
                <input
                  type="number"
                  id="precoPedido"
                  name="precoPedido"
                  value={formData.precoPedido}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Linha 4: Avaliação */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estrelas" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Star className="w-4 h-4 mr-2 text-violet-600" />
                  Estrelas (1-5)
                </label>
                <input
                  type="number"
                  id="estrelas"
                  name="estrelas"
                  value={formData.estrelas}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="1 a 5"
                />
              </div>

              <div>
                <label htmlFor="avaliacao" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-violet-600" />
                  Avaliação
                </label>
                <input
                  type="text"
                  id="avaliacao"
                  name="avaliacao"
                  value={formData.avaliacao}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  placeholder="Comentário sobre o pedido"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Cadastrar Pedido
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}