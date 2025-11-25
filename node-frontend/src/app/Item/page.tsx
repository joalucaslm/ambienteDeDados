"use client";

import { useState } from "react";
import { Store, Package, FileText, Tag, DollarSign } from "lucide-react";

export default function Item() {
  const [formData, setFormData] = useState({
    idRestaurante: "",
    nome: "",
    descricao: "",
    idTipo: "",
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
      const response = await fetch("http://localhost:8080/item/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          preco: parseFloat(formData.preco),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Item cadastrado:", data);
        alert("Item cadastrado com sucesso!");
        setFormData({
          idRestaurante: "",
          nome: "",
          descricao: "",
          idTipo: "",
          preco: "",
        });
      } else {
        alert("Erro ao cadastrar item. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <article className="bg-gradient-to-br from-emerald-50 to-green-100 w-full min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cadastro de Item
          </h1>
          <p className="text-gray-600 mb-8">
            Adicione um novo item ao cardápio
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="idRestaurante"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Store className="w-4 h-4 mr-2 text-emerald-600" />
                ID do Restaurante
              </label>
              <input
                type="text"
                id="idRestaurante"
                name="idRestaurante"
                value={formData.idRestaurante}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="ID do restaurante"
              />
            </div>

            <div>
              <label
                htmlFor="nome"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Package className="w-4 h-4 mr-2 text-emerald-600" />
                Nome do Item
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="Ex: Pizza Margherita, Suco de Laranja, etc."
              />
            </div>

            <div>
              <label
                htmlFor="descricao"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="w-4 h-4 mr-2 text-emerald-600" />
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                placeholder="Descreva os ingredientes e características do item..."
              />
            </div>

            <div>
              <label
                htmlFor="idTipo"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Tag className="w-4 h-4 mr-2 text-emerald-600" />
                ID do Tipo
              </label>
              <input
                type="text"
                id="idTipo"
                name="idTipo"
                value={formData.idTipo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="ID do tipo de item"
              />
            </div>

            <div>
              <label
                htmlFor="preco"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
                Preço
              </label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Cadastrar Item
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
