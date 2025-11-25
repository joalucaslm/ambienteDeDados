"use client";

import { useState } from "react";
import {
  User,
  Phone,
  CreditCard,
  Bike,
  FileText,
  CheckCircle,
} from "lucide-react";

export default function Entregador() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    placaMoto: "",
    cnh: "",
    status: "ativo",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // evita reload da página

    try {
      const response = await fetch("http://localhost:8080/entregador/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar entregador");
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      alert("Entregador cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar entregador!");
    }
  };

  return (
    <article className="bg-gradient-to-br from-blue-50 to-indigo-100 w-full min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cadastro de Entregador
          </h1>
          <p className="text-gray-600 mb-8">
            Preencha os dados do entregador abaixo
          </p>

          <div className="space-y-6">
            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <User className="w-4 h-4 mr-2 text-indigo-600" />
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Digite o nome completo"
              />
            </div>

            {/* Telefone */}
            <div>
              <label
                htmlFor="telefone"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* CPF */}
            <div>
              <label
                htmlFor="cpf"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <CreditCard className="w-4 h-4 mr-2 text-indigo-600" />
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="000.000.000-00"
              />
            </div>

            {/* Placa da Moto */}
            <div>
              <label
                htmlFor="placaMoto"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <Bike className="w-4 h-4 mr-2 text-indigo-600" />
                Placa da Moto
              </label>
              <input
                type="text"
                id="placaMoto"
                name="placaMoto"
                value={formData.placaMoto}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="ABC-1234"
              />
            </div>

            {/* CNH */}
            <div>
              <label
                htmlFor="cnh"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                CNH
              </label>
              <input
                type="text"
                id="cnh"
                name="cnh"
                value={formData.cnh}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Número da CNH"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-indigo-600" />
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Em entrega">Em entrega</option>
              </select>
            </div>

            {/* Botão Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Cadastrar Entregador
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
