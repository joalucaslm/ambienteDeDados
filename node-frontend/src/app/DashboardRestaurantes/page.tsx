"use client";

import { useState, useEffect } from "react";
import { Store, Phone, DollarSign, MapPin, TrendingUp } from "lucide-react";

export default function DashboardRestaurante() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurantes();
    const interval = setInterval(fetchRestaurantes, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  const fetchRestaurantes = async () => {
    try {
      const response = await fetch("http://localhost:8080/restaurante/");
      const result = await response.json();

      if (result.success) {
        setRestaurantes(result.data);
        setError(null);
      } else {
        setError("Erro ao carregar restaurantes");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const getPrecoColor = (preco) => {
    if (!preco) return "bg-gray-100 text-gray-600 border-gray-200";
    const colors = {
      $: "bg-green-100 text-green-700 border-green-200",
      $$: "bg-yellow-100 text-yellow-700 border-yellow-200",
      $$$: "bg-orange-100 text-orange-700 border-orange-200",
      $$$$: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[preco] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getPrecoLabel = (preco) => {
    if (!preco) return "Não definido";
    const labels = {
      $: "Econômico",
      $$: "Moderado",
      $$$: "Caro",
      $$$$: "Premium",
    };
    return labels[preco] || preco;
  };

  const calcularEstatisticas = () => {
    const total = restaurantes.length;
    const comTelefone = restaurantes.filter((r) => r.telefone).length;
    const comPreco = restaurantes.filter((r) => r.preco).length;
    const porFaixaPreco = {
      $: restaurantes.filter((r) => r.preco === "$").length,
      $$: restaurantes.filter((r) => r.preco === "$$").length,
      $$$: restaurantes.filter((r) => r.preco === "$$$").length,
      $$$$: restaurantes.filter((r) => r.preco === "$$$$").length,
    };

    return { total, comTelefone, comPreco, porFaixaPreco };
  };

  if (loading) {
    return (
      <article className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </article>
    );
  }

  const stats = calcularEstatisticas();

  return (
    <article className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Dashboard de Restaurantes
          </h1>
          <p className="text-slate-600">
            Gerencie e acompanhe todos os restaurantes cadastrados
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">
                Total de Restaurantes
              </span>
              <Store className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">
                Com Telefone
              </span>
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {stats.comTelefone}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">
                Com Preço Definido
              </span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {stats.comPreco}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">
                Faixa Premium
              </span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {stats.porFaixaPreco["$$$"] + stats.porFaixaPreco["$$$$"]}
            </p>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Grid de Cards de Restaurantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantes.map((restaurante) => (
            <div
              key={restaurante.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-white rounded-full p-2">
                      <Store className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-white text-xs font-semibold">
                      ID #{restaurante.id}
                    </span>
                  </div>
                  {restaurante.preco && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getPrecoColor(
                        restaurante.preco
                      )}`}
                    >
                      {restaurante.preco}
                    </span>
                  )}
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {restaurante.nome}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 h-10">
                  {restaurante.descricao}
                </p>

                {/* Informações */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {restaurante.telefone || "Não informado"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {getPrecoLabel(restaurante.preco)}
                    </span>
                  </div>
                </div>

                {/* Footer do Card */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {restaurantes.length === 0 && !loading && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum restaurante encontrado</p>
          </div>
        )}

        {/* Tabela alternativa (opcional) */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">
              Visão em Tabela
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Faixa de Preço
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {restaurantes.map((restaurante) => (
                  <tr
                    key={restaurante.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-800">
                        #{restaurante.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-800">
                        {restaurante.nome}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 line-clamp-1">
                        {restaurante.descricao}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {restaurante.telefone || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {restaurante.preco ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getPrecoColor(
                            restaurante.preco
                          )}`}
                        >
                          {restaurante.preco}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Não definido
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </article>
  );
}
