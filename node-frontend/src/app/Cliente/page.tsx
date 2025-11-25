"use client"

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Home, Building, Package, CreditCard, X, Lock } from 'lucide-react';

export default function Cliente() {
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showEnderecoModal, setShowEnderecoModal] = useState(false);
  
  const [clienteData, setClienteData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: ''
  });

  const [enderecoData, setEnderecoData] = useState({
    idCliente: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    referencia: '',
    tipo: 'Residencial'
  });

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setClienteData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setEnderecoData(prev => ({ ...prev, [name]: value }));
  };

  const handleClienteSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/cliente/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Cliente cadastrado:', data);
        alert('Cliente cadastrado com sucesso!');
        setShowClienteModal(false);
        setClienteData({ nome: '', email: '', telefone: '', senha: ''});
      } else {
        console.log("Dados que chegaram")
        console.log(clienteData)
        alert('Erro ao cadastrar cliente. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const handleEnderecoSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/endereço/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enderecoData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Endereço cadastrado:', data);
        alert('Endereço cadastrado com sucesso!');
        setShowEnderecoModal(false);
        setEnderecoData({
          idCliente: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
          referencia: '',
          tipo: 'Residencial'
        });
      } else {
        alert('Erro ao cadastrar endereço. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };


  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'Residencial': return <Home className="w-4 h-4" />;
      case 'Comercial': return <Building className="w-4 h-4" />;
      case 'Entrega': return <Package className="w-4 h-4" />;
      case 'Cobranca': return <CreditCard className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  return (
    <article className="bg-gradient-to-br from-blue-50 to-indigo-100 w-full min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestão de Clientes</h1>
        
        <div className="flex gap-4">
          <button
            onClick={() => setShowClienteModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Cadastrar Cliente
          </button>
          
          <button
            onClick={() => setShowEnderecoModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Cadastrar Endereço
          </button>
        </div>

        {/* Modal Cliente */}
        {showClienteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Cadastro de Cliente</h2>
                <button
                  onClick={() => setShowClienteModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="nome" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-indigo-600" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={clienteData.nome}
                    onChange={handleClienteChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Digite o nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={clienteData.email}
                    onChange={handleClienteChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={clienteData.telefone}
                    onChange={handleClienteChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                 <div>
                  <label htmlFor="senha" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 mr-2 text-indigo-600" />
                    Senha
                  </label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={clienteData.senha}
                    onChange={handleClienteChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <button
                  onClick={handleClienteSubmit}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  Cadastrar Cliente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Endereço */}
        {showEnderecoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Cadastro de Endereço</h2>
                <button
                  onClick={() => setShowEnderecoModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="idCliente" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-green-600" />
                    ID do Cliente
                  </label>
                  <input
                    type="text"
                    id="idCliente"
                    name="idCliente"
                    value={enderecoData.idCliente}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="ID do cliente"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="logradouro" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      Logradouro
                    </label>
                    <input
                      type="text"
                      id="logradouro"
                      name="logradouro"
                      value={enderecoData.logradouro}
                      onChange={handleEnderecoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="numero" className="text-sm font-medium text-gray-700 mb-2 block">
                      Número
                    </label>
                    <input
                      type="text"
                      id="numero"
                      name="numero"
                      value={enderecoData.numero}
                      onChange={handleEnderecoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="123"
                    />
                  </div>

                  <div>
                    <label htmlFor="complemento" className="text-sm font-medium text-gray-700 mb-2 block">
                      Complemento
                    </label>
                    <input
                      type="text"
                      id="complemento"
                      name="complemento"
                      value={enderecoData.complemento}
                      onChange={handleEnderecoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Apto, Bloco, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="bairro" className="text-sm font-medium text-gray-700 mb-2 block">
                      Bairro
                    </label>
                    <input
                      type="text"
                      id="bairro"
                      name="bairro"
                      value={enderecoData.bairro}
                      onChange={handleEnderecoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Nome do bairro"
                    />
                  </div>

                  <div>
                    <label htmlFor="cidade" className="text-sm font-medium text-gray-700 mb-2 block">
                      Cidade
                    </label>
                    <input
                      type="text"
                      id="cidade"
                      name="cidade"
                      value={enderecoData.cidade}
                      onChange={handleEnderecoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div>
                    <label htmlFor="estado" className="text-sm font-medium text-gray-700 mb-2 block">
                      Estado
                    </label>
                    <input
                      type="text"
                      id="estado"
                      name="estado"
                      value={enderecoData.estado}
                      onChange={handleEnderecoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="UF"
                      maxLength="2"
                    />
                  </div>

                  <div>
                    <label htmlFor="cep" className="text-sm font-medium text-gray-700 mb-2 block">
                      CEP
                    </label>
                    <input
                      type="text"
                      id="cep"
                      name="cep"
                      value={enderecoData.cep}
                      onChange={handleEnderecoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="referencia" className="text-sm font-medium text-gray-700 mb-2 block">
                    Referência
                  </label>
                  <input
                    type="text"
                    id="referencia"
                    name="referencia"
                    value={enderecoData.referencia}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Ponto de referência"
                  />
                </div>

                <div>
                  <label htmlFor="tipo" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    {getTipoIcon(enderecoData.tipo)}
                    <span className="ml-2">Tipo de Endereço</span>
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={enderecoData.tipo}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Cobranca">Cobrança</option>
                  </select>
                </div>

                <button
                  onClick={handleEnderecoSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  Cadastrar Endereço
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}