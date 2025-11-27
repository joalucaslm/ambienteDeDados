"use client";

import { useState } from "react";
import { Store, FileText, Phone, DollarSign, Hash } from "lucide-react";

export default function Restaurante() {
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    descricao: "",
    telefone: "",
    preco: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log(formData);
      const response = await fetch("http://localhost:8080/restaurante/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Restaurante cadastrado:", data);
        alert("Restaurante cadastrado com sucesso!");
        setFormData({
          id: "",
          nome: "",
          descricao: "",
          telefone: "",
          preco: "",
        });
      } else {
        alert("Erro ao cadastrar restaurante. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <article className="bg-gradient-to-br from-amber-50 to-yellow-100 w-full min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cadastro de Restaurante
          </h1>
          <p className="text-gray-600 mb-8">
            Adicione um novo restaurante ao sistema
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="id"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Hash className="w-4 h-4 mr-2 text-amber-600" />
                ID do Restaurante
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="ID único do restaurante"
              />
            </div>

            <div>
              <label
                htmlFor="nome"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Store className="w-4 h-4 mr-2 text-amber-600" />
                Nome do Restaurante
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="Ex: Pizzaria Bella Italia"
              />
            </div>

            <div>
              <label
                htmlFor="descricao"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="w-4 h-4 mr-2 text-amber-600" />
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition resize-none"
                placeholder="Descreva o restaurante, tipo de culinária, especialidades..."
              />
            </div>

            <div>
              <label
                htmlFor="telefone"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Phone className="w-4 h-4 mr-2 text-amber-600" />
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                placeholder="(00) 00000-0000"
              />
            </div>

           
            <div>
              <label
                htmlFor="preco"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <DollarSign className="w-4 h-4 mr-2 text-amber-600" />
                Faixa de Preço
              </label>
              <select
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white"
              >
                <option value="">Selecione a faixa de preço</option>
                <option value="$">$ - Econômico</option>
                <option value="$$">$$ - Moderado</option>
                <option value="$$$">$$$ - Premium</option>
              </select>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Cadastrar Restaurante
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
