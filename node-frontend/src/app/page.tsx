'use client'
'use client'

import { useState } from 'react';
import { Search, Package, Store, Star, MapPin, Clock, DollarSign, CreditCard, User, Phone, Utensils, Menu, X } from 'lucide-react';

// Tipos
type TipoBusca = 'pedido' | 'restaurante';

type Page = 
  | "Cliente"
  | "Entregador"
  | "HorarioFuncionamento"
  | "Item"
  | "Pagamento"
  | "Pedido"
  | "PedidoItem"
  | "Restaurante"
  | "TipoCozinha"
  | "TipoItem"
  | "DashboardPedidos"
  | "DashboardRestaurantes";

interface DadosPedido {
  id: number;
  nomeCliente: string;
  status: string;
  metodoPagamento: string;
  avaliacao: string;
  estrelas: number;
  precoPedido: string;
  entregador: string;
  restaurante: string;
  inicioPedido: string;
  fimPedido: string;
  enderecoCompleto: string;
  referenciaEndereco: string;
}

interface DadosRestaurante {
  id: number;
  nome: string;
  descricao: string;
  telefone: string;
  preco: string;
  formas_pagamento: string;
  tipos_cozinha: string;
  horarios_funcionamento?: string;
}

type DadosResponse = DadosPedido | DadosRestaurante;

interface ApiResponse {
  success: boolean;
  data: DadosResponse;
  message: string;
}

export default function Home() {
  const [tipoBusca, setTipoBusca] = useState<TipoBusca>('pedido');
  const [idBusca, setIdBusca] = useState<string>('');
  const [dados, setDados] = useState<DadosResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>('');
  const [menuAberto, setMenuAberto] = useState<boolean>(false);

  const pages: Page[] = [
    "Cliente",
    "Entregador",
    "HorarioFuncionamento",
    "Item",
    "Pagamento",
    "Pedido",
    "PedidoItem",
    "Restaurante",
    "TipoCozinha",
    "TipoItem",
    "DashboardPedidos",
    "DashboardRestaurantes"
  ];

  const navegarPara = (page: Page): void => {
    window.location.href = `/${page}`;
    setMenuAberto(false);
  };

  const buscarDados = async (): Promise<void> => {
    if (!idBusca) {
      setErro('Por favor, insira um ID');
      return;
    }

    setLoading(true);
    setErro('');
    setDados(null);

    try {
      const url = `http://localhost:8080/${tipoBusca}/${idBusca}/allInfos`;
      const response = await fetch(url);
      const result: ApiResponse = await response.json();

      if (result.success) {
        setDados(result.data);
      } else {
        setErro('Dados não encontrados');
      }
    } catch (error) {
      setErro('Erro ao buscar dados. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      buscarDados();
    }
  };

  const isPedido = (dados: DadosResponse): dados is DadosPedido => {
    return 'nomeCliente' in dados;
  };

  const isRestaurante = (dados: DadosResponse): dados is DadosRestaurante => {
    return 'nome' in dados;
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      {/* Botão Menu Flutuante */}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className="fixed top-4 right-4 z-50 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        aria-label="Menu de páginas"
      >
        {menuAberto ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu Dropdown */}
      {menuAberto && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setMenuAberto(false)}
          />
          
          {/* Menu */}
          <div className="fixed top-20 right-4 bg-white rounded-2xl shadow-2xl p-4 z-50 w-64 max-h-[70vh] overflow-y-auto">
            <h3 className="font-bold text-gray-800 mb-3 text-lg border-b pb-2">
              Navegação
            </h3>
            <div className="space-y-1">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => navegarPara(page)}
                  className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors text-gray-700 font-medium"
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sistema de Consulta
          </h1>
          <p className="text-gray-600">Busque informações de pedidos ou restaurantes</p>
        </div>

        {/* Formulário de Busca */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setTipoBusca('pedido')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                tipoBusca === 'pedido'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Package className="inline mr-2" size={20} />
              Pedido
            </button>
            <button
              onClick={() => setTipoBusca('restaurante')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                tipoBusca === 'restaurante'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Store className="inline mr-2" size={20} />
              Restaurante
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={idBusca}
              onChange={(e) => setIdBusca(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Digite o ID do ${tipoBusca}`}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
            />
            <button
              onClick={buscarDados}
              disabled={loading}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Buscando...'
              ) : (
                <>
                  <Search className="inline mr-2" size={20} />
                  Buscar
                </>
              )}
            </button>
          </div>

          {erro && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {erro}
            </div>
          )}
        </div>

        {/* Resultados - Pedido */}
        {dados && tipoBusca === 'pedido' && isPedido(dados) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Pedido #{dados.id}
              </h2>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                dados.status === 'Entregue' ? 'bg-green-100 text-green-700' :
                dados.status === 'Em preparo' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {dados.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-semibold text-gray-800">{dados.nomeCliente}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Store className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Restaurante</p>
                    <p className="font-semibold text-gray-800">{dados.restaurante}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Entregador</p>
                    <p className="font-semibold text-gray-800">{dados.entregador}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Valor do Pedido</p>
                    <p className="font-semibold text-gray-800 text-xl">R$ {dados.precoPedido}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Pagamento</p>
                    <p className="font-semibold text-gray-800">{dados.metodoPagamento}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Horários</p>
                    <p className="font-semibold text-gray-800">Início: {dados.inicioPedido}</p>
                    <p className="font-semibold text-gray-800">Fim: {dados.fimPedido}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Endereço de Entrega</p>
                    <p className="font-semibold text-gray-800">{dados.enderecoCompleto}</p>
                    {dados.referenciaEndereco && (
                      <p className="text-sm text-gray-600 mt-1">📍 {dados.referenciaEndereco}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {dados.avaliacao && (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-amber-500 fill-amber-500" size={20} />
                  <span className="font-bold text-gray-800">{dados.estrelas}/5</span>
                </div>
                <p className="text-gray-700 italic">"{dados.avaliacao}"</p>
              </div>
            )}
          </div>
        )}

        {/* Resultados - Restaurante */}
        {dados && tipoBusca === 'restaurante' && isRestaurante(dados) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {dados.nome}
              </h2>
              <p className="text-gray-600">{dados.descricao}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-semibold text-gray-800">{dados.telefone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Faixa de Preço</p>
                    <p className="font-semibold text-gray-800 text-xl">{dados.preco}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Formas de Pagamento</p>
                    <p className="font-semibold text-gray-800">{dados.formas_pagamento}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Utensils className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Tipos de Cozinha</p>
                    <p className="font-semibold text-gray-800">{dados.tipos_cozinha}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-orange-500 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Horários de Funcionamento</p>
                    <p className="font-semibold text-gray-800 whitespace-pre-line">
                      {dados.horarios_funcionamento?.split(' | ').join('\n') || 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}