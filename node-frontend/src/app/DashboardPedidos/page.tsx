"use client"

import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Star, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:8080/pedido/all');
      const result = await response.json();
      
      if (result.success) {
        setPedidos(result.data);
        setError(null);
      } else {
        setError('Erro ao carregar pedidos');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Entregue': 'bg-green-100 text-green-700 border-green-200',
      'Pendente': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Em preparo': 'bg-blue-100 text-blue-700 border-blue-200',
      'Cancelado': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Entregue': return <CheckCircle className="w-4 h-4" />;
      case 'Pendente': return <Clock className="w-4 h-4" />;
      case 'Em preparo': return <Package className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const calcularEstatisticas = () => {
    const total = pedidos.length;
    const entregues = pedidos.filter(p => p.status === 'Entregue').length;
    const valorTotal = pedidos.reduce((acc, p) => acc + parseFloat(p.precoPedido), 0);
    const mediaEstrelas = pedidos.filter(p => p.estrelas).reduce((acc, p) => acc + p.estrelas, 0) / pedidos.filter(p => p.estrelas).length || 0;
    
    return { total, entregues, valorTotal, mediaEstrelas };
  };

  if (loading) {
    return (
      <article className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </article>
    );
  }

  const stats = calcularEstatisticas();

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard de Pedidos</h1>
          <p className="text-slate-600">Acompanhe seus pedidos em tempo real</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Total de Pedidos</span>
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Entregues</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.entregues}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Valor Total</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">R$ {stats.valorTotal.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm font-medium">Média de Avaliação</span>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.mediaEstrelas.toFixed(1)} ⭐</p>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabela de Pedidos */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Valor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Horário</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Avaliação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-800">#{pedido.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pedido.status)}`}>
                        {getStatusIcon(pedido.status)}
                        {pedido.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      Cliente #{pedido.idCliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                      R$ {parseFloat(pedido.precoPedido).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Início: {pedido.inicioPedido}</span>
                        {pedido.fimPedido && <span className="text-xs text-slate-500">Fim: {pedido.fimPedido}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {pedido.estrelas ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-slate-800">{pedido.estrelas}</span>
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Sem avaliação</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {pedidos.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </article>
  );
}