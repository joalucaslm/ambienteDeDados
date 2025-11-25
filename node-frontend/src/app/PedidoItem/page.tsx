"use client";

import { useState } from "react";
import { ShoppingCart, Package, Hash, DollarSign } from "lucide-react";

export default function PedidoItem() {
  const [formData, setFormData] = useState({
    idPedido: "",
    idItem: "",
    quantidade: "",
    precoUnitario: "",
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
      const response = await fetch("http://localhost:8080/pedido/Item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantidade: parseInt(formData.quantidade),
          precoUnitario: parseFloat(formData.precoUnitario),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Item do pedido cadastrado:", data);
        alert("Item adicionado ao pedido com sucesso!");
        setFormData({
          idPedido: "",
          idItem: "",
          quantidade: "",
          precoUnitario: "",
        });
      } else {
        alert("Erro ao adicionar item ao pedido. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  const calcularTotal = () => {
    const quantidade = parseFloat(formData.quantidade) || 0;
    const precoUnitario = parseFloat(formData.precoUnitario) || 0;
    return (quantidade * precoUnitario).toFixed(2);
  };

  return (
    <article className="bg-gradient-to-br from-sky-50 to-blue-100 w-full min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Adicionar Item ao Pedido
          </h1>
          <p className="text-gray-600 mb-8">
            Vincule um item a um pedido existente
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="idPedido"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <ShoppingCart className="w-4 h-4 mr-2 text-sky-600" />
                ID do Pedido
              </label>
              <input
                type="text"
                id="idPedido"
                name="idPedido"
                value={formData.idPedido}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="ID do pedido"
              />
            </div>

            <div>
              <label
                htmlFor="idItem"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Package className="w-4 h-4 mr-2 text-sky-600" />
                ID do Item
              </label>
              <input
                type="text"
                id="idItem"
                name="idItem"
                value={formData.idItem}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="ID do item"
              />
            </div>

            <div>
              <label
                htmlFor="quantidade"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Hash className="w-4 h-4 mr-2 text-sky-600" />
                Quantidade
              </label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="1"
              />
            </div>

            <div>
              <label
                htmlFor="precoUnitario"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <DollarSign className="w-4 h-4 mr-2 text-sky-600" />
                Preço Unitário
              </label>
              <input
                type="number"
                id="precoUnitario"
                name="precoUnitario"
                value={formData.precoUnitario}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>

            {formData.quantidade && formData.precoUnitario && (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-sky-600">
                    R$ {calcularTotal()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Adicionar Item ao Pedido
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
