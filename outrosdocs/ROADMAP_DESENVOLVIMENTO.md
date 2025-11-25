# 🗺️ Roadmap de Desenvolvimento - Ambiente de Dados

## 📊 Status Geral do Projeto

Seu projeto é um **Sistema de Delivery de Restaurantes** (tipo iFood/Uber Eats). 

**O que você tem:**
- ✅ Banco de dados com 13 tabelas criadas
- ✅ Controller de Pedidos (CRUD básico)
- ✅ Model de Pedidos (com transações)
- ✅ Rotas de Pedidos
- ✅ Middleware de Autenticação JWT
- ✅ Servidor Express rodando

**O que FALTA:**

---

## 🚨 PRIORIDADE 1: Controllers & Models (CRÍTICO)

### 1. **Controller de Clientes**
📁 Criar: `controller/clienteController.js`

**Funcionalidades necessárias:**
```javascript
- GET /cliente - Listar todos
- GET /cliente/:id - Buscar por ID
- POST /cliente - Criar novo cliente
- PUT /cliente/:id - Atualizar dados
- DELETE /cliente/:id - Deletar cliente
```

**Dados esperados:**
```
{
  id: 1,
  nome: "João Lucas",
  email: "joaolucaslimamaia@gmail.com",
  telefone: "85982194601"
}
```

---

### 2. **Controller de Restaurantes**
📁 Criar: `controller/restauranteController.js`

**Funcionalidades necessárias:**
```javascript
- GET /restaurante - Listar todos com filtro (preço, tipo de cozinha)
- GET /restaurante/:id - Buscar por ID (com horários e itens)
- POST /restaurante - Criar novo restaurante
- PUT /restaurante/:id - Atualizar dados
- DELETE /restaurante/:id - Deletar
- GET /restaurante/:id/itens - Listar itens do restaurante
- GET /restaurante/:id/horarios - Horários de funcionamento
```

---

### 3. **Controller de Itens (Produtos do Menu)**
📁 Criar: `controller/itemController.js`

**Funcionalidades necessárias:**
```javascript
- GET /item - Listar todos
- GET /item/:id - Buscar por ID
- GET /restaurante/:idRestaurante/itens - Itens de um restaurante
- POST /item - Criar novo item
- PUT /item/:id - Atualizar item
- DELETE /item/:id - Deletar item
```

---

### 4. **Controller de Entregadores**
📁 Criar: `controller/entregadorController.js`

**Funcionalidades necessárias:**
```javascript
- GET /entregador - Listar todos (com status)
- GET /entregador/:id - Buscar por ID
- POST /entregador - Criar novo
- PUT /entregador/:id - Atualizar
- PUT /entregador/:id/status - Mudar status (ativo, inativo, Em entrega)
- DELETE /entregador/:id - Deletar
```

---

### 5. **Controller de Endereços**
📁 Criar: `controller/enderecoController.js`

**Funcionalidades necessárias:**
```javascript
- GET /endereco - Listar todos
- GET /cliente/:idCliente/endereco - Endereços de um cliente
- GET /restaurante/:idRestaurante/endereco - Endereço do restaurante
- POST /endereco - Criar novo
- PUT /endereco/:id - Atualizar
- DELETE /endereco/:id - Deletar
```

---

### 6. **Models para todas as tabelas**
📁 Criar: 
- `models/clienteModel.js`
- `models/restauranteModel.js`
- `models/itemModel.js`
- `models/entregadorModel.js`
- `models/enderecoModel.js`
- `models/pagamentoModel.js`
- `models/horarioFuncionamentoModel.js`

---

## 🌐 PRIORIDADE 2: Rotas (IMPORTANTE)

📁 Criar os arquivos de rotas para cada entidade:

```javascript
routes/
├── clienteRoutes.js
├── restauranteRoutes.js
├── itemRoutes.js
├── entregadorRoutes.js
├── enderecoRoutes.js
├── pagamentoRoutes.js
└── horarioFuncionamentoRoutes.js
```

Cada um seguindo o mesmo padrão de `pedidoRoutes.js`.

---

## 🔐 PRIORIDADE 3: Autenticação & Autorização

### 1. **Controller de Autenticação**
📁 Criar: `controller/authController.js`

**Funcionalidades:**
```javascript
- POST /auth/register - Registrar novo cliente
- POST /auth/login - Login (retorna JWT)
- POST /auth/refresh - Renovar token
- POST /auth/logout - Logout
```

**Resposta esperada:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "nome": "João", "email": "joao@email.com" },
  "expiresIn": 3600
}
```

### 2. **Melhorar authMiddleware.js**
- ✅ Já existe verificação de JWT
- 🔄 Precisa adicionar:
  - Rotas públicas (sem autenticação)
  - Rotas privadas (com autenticação)
  - Verificação de permissões (Admin, Cliente, Entregador)

---

## ✔️ PRIORIDADE 4: Validações

Criar um arquivo `utils/validadores.js`:

```javascript
// Validar Email
// Validar Telefone (formato BR)
// Validar CPF
// Validar CEP
// Validar Placa de Moto
// Validar Status válidos
// Validar Enum values
```

---

## 🛡️ PRIORIDADE 5: Tratamento de Erros

Criar um arquivo `utils/errorHandler.js`:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware de tratamento de erros global
```

---

## 📝 PRIORIDADE 6: Documentação & Logging

### 1. **Logger Centralizado**
📁 Criar: `utils/logger.js`
- Registrar todas as requisições
- Registrar erros
- Timestamps

### 2. **README completo**
- Instruções de instalação
- Como rodar o servidor
- Endpoints documentados
- Exemplo de requisições

### 3. **Documentação da API**
- Swagger/OpenAPI (opcional, mas recomendado)

---

## 📊 Estrutura Final Esperada

```
node.js/
├── index.js                    (PRONTO ✅)
├── package.json                (PRONTO ✅)
├── .env                         (PRONTO ✅)
│
├── config/
│   └── db.js                   (PRONTO ✅)
│
├── middleware/
│   ├── authMiddleware.js       (PRONTO ✅ - mas precisa melhorias)
│   └── errorHandler.js         (🔄 CRIAR)
│
├── controller/
│   ├── pedidoController.js     (PRONTO ✅)
│   ├── clienteController.js    (🔄 CRIAR)
│   ├── restauranteController.js (🔄 CRIAR)
│   ├── itemController.js       (🔄 CRIAR)
│   ├── entregadorController.js (🔄 CRIAR)
│   ├── enderecoController.js   (🔄 CRIAR)
│   ├── pagamentoController.js  (🔄 CRIAR)
│   ├── horarioFuncionamentoController.js (🔄 CRIAR)
│   └── authController.js       (🔄 CRIAR)
│
├── models/
│   ├── pedidoModel.js          (PRONTO ✅)
│   ├── clienteModel.js         (🔄 CRIAR)
│   ├── restauranteModel.js     (🔄 CRIAR)
│   ├── itemModel.js            (🔄 CRIAR)
│   ├── entregadorModel.js      (🔄 CRIAR)
│   ├── enderecoModel.js        (🔄 CRIAR)
│   ├── pagamentoModel.js       (🔄 CRIAR)
│   └── horarioFuncionamentoModel.js (🔄 CRIAR)
│
├── routes/
│   ├── pedidoRoutes.js         (PRONTO ✅)
│   ├── clienteRoutes.js        (🔄 CRIAR)
│   ├── restauranteRoutes.js    (🔄 CRIAR)
│   ├── itemRoutes.js           (🔄 CRIAR)
│   ├── entregadorRoutes.js     (🔄 CRIAR)
│   ├── enderecoRoutes.js       (🔄 CRIAR)
│   ├── pagamentoRoutes.js      (🔄 CRIAR)
│   ├── horarioFuncionamentoRoutes.js (🔄 CRIAR)
│   └── authRoutes.js           (🔄 CRIAR)
│
├── utils/
│   ├── validadores.js          (🔄 CRIAR)
│   ├── errorHandler.js         (🔄 CRIAR)
│   └── logger.js               (🔄 CRIAR)
│
└── docs/                       (PRONTO ✅)
    └── ... (já tem tudo)
```

---

## 🎯 Plano de Ação Recomendado

### **Semana 1: Fundação**
1. Criar Validadores (`utils/validadores.js`)
2. Criar Error Handler (`utils/errorHandler.js`)
3. Criar Logger (`utils/logger.js`)

### **Semana 2: Core Models & Controllers**
4. Cliente (Model + Controller + Routes)
5. Endereço (Model + Controller + Routes)
6. Restaurante (Model + Controller + Routes)

### **Semana 3: Complemento**
7. Item/Menu (Model + Controller + Routes)
8. Entregador (Model + Controller + Routes)
9. Pagamento (Model + Controller + Routes)

### **Semana 4: Autenticação & Polimento**
10. Auth (Controller + Routes)
11. Melhorar middleware de autenticação
12. Testes completos
13. Documentação final

---

## 💡 Quick Start para Criar um Novo Controller

### Passo 1: Criar o Model
```javascript
// models/clienteModel.js
const { pool } = require("../config/db");

class ClienteModel {
  static async findAll() {
    const query = "SELECT * FROM cliente";
    try {
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM cliente WHERE id = ?";
    try {
      const [rows] = await pool.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }
  }

  static async create(clienteData) {
    const { nome, email, telefone } = clienteData;
    const query = "INSERT INTO cliente (nome, email, telefone) VALUES (?, ?, ?)";
    try {
      const [result] = await pool.query(query, [nome, email, telefone]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Erro ao criar cliente: ${error.message}`);
    }
  }

  static async update(id, clienteData) {
    const { nome, email, telefone } = clienteData;
    const query = "UPDATE cliente SET nome = ?, email = ?, telefone = ? WHERE id = ?";
    try {
      const [result] = await pool.query(query, [nome, email, telefone, id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao atualizar cliente: ${error.message}`);
    }
  }

  static async delete(id) {
    const query = "DELETE FROM cliente WHERE id = ?";
    try {
      const [result] = await pool.query(query, [id]);
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Erro ao deletar cliente: ${error.message}`);
    }
  }
}

module.exports = ClienteModel;
```

### Passo 2: Criar o Controller
```javascript
// controller/clienteController.js
const ClienteModel = require("../models/clienteModel");

const getClientes = async (req, res) => {
  try {
    const clientes = await ClienteModel.findAll();
    return res.status(200).json({
      success: true,
      data: clientes,
      message: "Lista de clientes"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await ClienteModel.findById(id);
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Cliente não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      data: cliente,
      message: "Cliente recuperado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

const createCliente = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;

    if (!nome || !email) {
      return res.status(400).json({
        success: false,
        message: "Nome e email são obrigatórios"
      });
    }

    const novoClienteId = await ClienteModel.create({ nome, email, telefone });
    return res.status(201).json({
      success: true,
      data: { id: novoClienteId },
      message: "Cliente criado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, telefone } = req.body;

    const affectedRows = await ClienteModel.update(id, { nome, email, telefone });
    
    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cliente atualizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;

    const affectedRows = await ClienteModel.delete(id);
    
    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cliente não encontrado"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cliente deletado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente
};
```

### Passo 3: Criar as Rotas
```javascript
// routes/clienteRoutes.js
const express = require("express");
const clienteController = require("../controller/clienteController");

const router = express.Router();

router.get("/", clienteController.getClientes);
router.get("/:id", clienteController.getClienteById);
router.post("/", clienteController.createCliente);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

module.exports = router;
```

### Passo 4: Registrar no index.js
```javascript
// Adicionar em index.js
const clienteRoutes = require("./routes/clienteRoutes");

// ... outras importações ...

app.use("/cliente", clienteRoutes);

// ... resto do código ...
```

---

## 🎉 Conclusão

**Você tem 40% do projeto pronto!**

O que falta são principalmente:
- 8 Controllers adicionais
- 8 Models adicionais
- 8 Rotas adicionais
- Autenticação completa
- Utilitários (validadores, error handler, logger)

A boa notícia: **Todos seguem o mesmo padrão** do que você já tem!

Quer que eu comece a implementar algum desses? Por exemplo, começo com **Cliente** que é bem simples?
