# 📚 Guia de Aprendizado - Padrão MVC

## 🎯 O que você acabou de aprender

Você implementou o **CRUD de Cliente** seguindo o padrão **MVC (Model-View-Controller)**.

---

## 🏗️ Os 4 Pilares

### 1. **MODEL** (`models/clienteModel.js`)
```
O que faz: Gerencia os dados no banco de dados
Responsabilidades:
- Buscar dados
- Inserir dados
- Atualizar dados
- Deletar dados
- Validações de banco de dados
```

**Métodos principais:**
```javascript
findAll()          // SELECT * 
findById(id)       // SELECT WHERE id
findByEmail(email) // SELECT WHERE email
create(data)       // INSERT
update(id, data)   // UPDATE
delete(id)         // DELETE
```

---

### 2. **CONTROLLER** (`controller/clienteController.js`)
```
O que faz: Intermediário entre as Rotas e o Model
Responsabilidades:
- Receber requisições
- Validar dados
- Chamar o Model
- Retornar respostas ao cliente
- Tratamento de erros
```

**Função padrão do Controller:**
```javascript
const getClientes = async (req, res) => {
  try {
    // 1. Validação
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID é obrigatório"
      });
    }

    // 2. Chamar o Model
    const cliente = await ClienteModel.findById(id);
    
    // 3. Verificar resultado
    if (!cliente) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Cliente não encontrado"
      });
    }

    // 4. Retornar sucesso
    return res.status(200).json({
      success: true,
      data: cliente,
      message: "Cliente recuperado com sucesso"
    });
  } catch (error) {
    // 5. Tratamento de erro
    return res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};
```

---

### 3. **ROUTES** (`routes/clienteRoutes.js`)
```
O que faz: Define os endpoints (URLs) da aplicação
Responsabilidades:
- Mapear URLs aos controllers
- Definir métodos HTTP (GET, POST, PUT, DELETE)
```

**Estrutura padrão:**
```javascript
const express = require("express");
const clienteController = require("../controller/clienteController");

const router = express.Router();

// GET /cliente - Listar todos
router.get("/", clienteController.getClientes);

// GET /cliente/:id - Buscar por ID
router.get("/:id", clienteController.getClienteById);

// POST /cliente - Criar
router.post("/", clienteController.createCliente);

// PUT /cliente/:id - Atualizar
router.put("/:id", clienteController.updateCliente);

// DELETE /cliente/:id - Deletar
router.delete("/:id", clienteController.deleteCliente);

module.exports = router;
```

---

### 4. **INDEX.JS** (Registro das Rotas)
```
O que faz: Conecta as rotas à aplicação
Responsabilidades:
- Importar as rotas
- Registrar as rotas no Express
```

**Como funciona:**
```javascript
// 1. Importar
const clienteRoutes = require("./routes/clienteRoutes");

// 2. Registrar (O prefixo é /cliente)
app.use("/cliente", clienteRoutes);

// Resultado: 
// GET /cliente
// GET /cliente/:id
// POST /cliente
// PUT /cliente/:id
// DELETE /cliente/:id
```

---

## 🔄 Fluxo de uma Requisição

```
1. Cliente faz requisição
   GET http://localhost:8080/cliente/1

2. Index.js recebe e encaminha para clienteRoutes
   app.use("/cliente", clienteRoutes)

3. ClienteRoutes procura por "/:id" com GET
   router.get("/:id", clienteController.getClienteById)

4. Chama clienteController.getClienteById
   - Extrai o ID dos parâmetros
   - Valida o ID
   
5. ClienteController chama ClienteModel.findById(1)
   - Model executa SQL: SELECT * FROM cliente WHERE id = 1
   - Retorna o resultado

6. ClienteController processa o resultado
   - Se encontrou → Retorna 200 com dados
   - Se não encontrou → Retorna 404
   - Se erro → Retorna 500

7. Resposta volta ao cliente
   {
     "success": true,
     "data": { id: 1, nome: "João", ... },
     "message": "Cliente recuperado com sucesso"
   }
```

---

## 📋 Padrão de Resposta

Todas as respostas seguem este padrão:

```javascript
{
  success: boolean,      // true ou false
  data: object|array,    // Os dados retornados (null em erros)
  message: string        // Mensagem descritiva
}
```

**Exemplos:**

Sucesso (200):
```json
{
  "success": true,
  "data": { "id": 1, "nome": "João" },
  "message": "Cliente recuperado com sucesso"
}
```

Erro de validação (400):
```json
{
  "success": false,
  "data": null,
  "message": "Nome e email são obrigatórios"
}
```

Não encontrado (404):
```json
{
  "success": false,
  "data": null,
  "message": "Cliente não encontrado"
}
```

Erro de servidor (500):
```json
{
  "success": false,
  "data": null,
  "message": "Erro ao buscar cliente: ..."
}
```

---

## 🔢 Códigos HTTP Utilizados

| Código | Significado | Quando usar |
|--------|-------------|------------|
| **200** | OK | Sucesso em GET, PUT, DELETE |
| **201** | Created | Sucesso em POST (criou novo recurso) |
| **400** | Bad Request | Dados inválidos/incompletos |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Violação de constraint (ex: email duplicado) |
| **500** | Server Error | Erro no servidor |

---

## 🎓 Checklist - Como Replicar para Outras Entidades

Quando for criar **Restaurante**, **Entregador**, etc., siga estes passos:

- [ ] 1. Criar arquivo `models/nomeModel.js`
  - [ ] Método `findAll()`
  - [ ] Método `findById(id)`
  - [ ] Método `create(data)`
  - [ ] Método `update(id, data)`
  - [ ] Método `delete(id)`
  - [ ] Métodos especiais (ex: `findByEmail`)

- [ ] 2. Criar arquivo `controller/nomeController.js`
  - [ ] Função `getNomes()` - Listar todos
  - [ ] Função `getNomeById()` - Buscar por ID
  - [ ] Função `createNome()` - Criar novo
  - [ ] Função `updateNome()` - Atualizar
  - [ ] Função `deleteNome()` - Deletar
  - [ ] Validações apropriadas

- [ ] 3. Criar arquivo `routes/nomeRoutes.js`
  - [ ] GET /nome
  - [ ] GET /nome/:id
  - [ ] POST /nome
  - [ ] PUT /nome/:id
  - [ ] DELETE /nome/:id

- [ ] 4. Registrar em `index.js`
  - [ ] Importar as rotas
  - [ ] `app.use("/nome", nomeRoutes)`

- [ ] 5. Testar no Thunder Client
  - [ ] GET - Listar todos
  - [ ] GET - Por ID
  - [ ] POST - Criar novo
  - [ ] PUT - Atualizar
  - [ ] DELETE - Deletar

---

## 🔍 Próximo Passo

Agora que você entende o padrão, vamos criar o **Endereço** que é um pouco mais complexo pois tem relação com Cliente.

Quer que eu implemente **Endereço** agora? Ele terá uma coluna `idCliente` (chave estrangeira).

---

## 📝 Dicas de Desenvolvimento

### 1. **Sempre valide os dados**
```javascript
if (!nome || !email) {
  return res.status(400).json({
    success: false,
    message: "Nome e email são obrigatórios"
  });
}
```

### 2. **Use try-catch em tudo**
```javascript
try {
  // código
} catch (error) {
  return res.status(500).json({
    success: false,
    message: error.message
  });
}
```

### 3. **Sempre return a resposta**
```javascript
return res.status(200).json(...);  // ✅ Correto
res.json(...);                      // ❌ Pode causar problemas
```

### 4. **Use parametrizadas no SQL**
```javascript
const query = "SELECT * FROM cliente WHERE id = ?";  // ✅ Seguro
await pool.query(query, [id]);

// NUNCA faça isso:
const query = `SELECT * FROM cliente WHERE id = ${id}`;  // ❌ SQL Injection
```

### 5. **Nomeie bem as variáveis**
```javascript
const cliente = await ClienteModel.findById(id);  // ✅ Claro
const c = await ClienteModel.findById(id);        // ❌ Confuso
```

---

## 🚀 Você está pronto!

Você agora sabe:
✅ Como criar um Model  
✅ Como criar um Controller  
✅ Como criar as Rotas  
✅ Como registrar no index.js  
✅ Como testar no Thunder Client  
✅ O padrão de resposta  
✅ Códigos HTTP  
✅ Validações básicas  

**Próximo desafio:** Implementar **Endereço** com relacionamento com Cliente!

Quer começar?
