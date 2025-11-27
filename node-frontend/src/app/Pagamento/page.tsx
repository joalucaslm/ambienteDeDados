"use client"

import { useState } from 'react';
import { CreditCard } from 'lucide-react';

export default function Pagamento() {
  const [formData, setFormData] = useState({
    nome: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/pagamento/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Pagamento cadastrado:', data);
        alert('Forma de pagamento cadastrada com sucesso!');
        setFormData({ nome: '' });
      } else {
        alert('Erro ao cadastrar forma de pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <article className="bg-gradient-to-br from-purple-50 to-pink-100 w-full min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cadastro de Forma de Pagamento</h1>
          <p className="text-gray-600 mb-8">Adicione uma nova forma de pagamento</p>

          <div className="space-y-6">
            <div>
              <label htmlFor="nome" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 mr-2 text-purple-600" />
                Nome da Forma de Pagamento
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Ex: Dinheiro, Cartão de Crédito, PIX, etc."
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Cadastrar Forma de Pagamento
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}