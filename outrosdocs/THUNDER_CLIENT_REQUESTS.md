# 🧪 Testes com Thunder Client

## URL Base
```
http://localhost:8080
```

---

# 👥 CLIENTE

## 1️⃣ **GET - Listar Todos os Clientes**

**Método:** `GET`  
**URL:** `http://localhost:8080/cliente`

**Esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Lucas",
      "email": "joaolucaslimamaia@gmail.com",
      "telefone": "85982194601"
    }
  ],
  "message": "Lista de clientes"
}
```

---

## 2️⃣ **GET - Buscar Cliente por ID**

**Método:** `GET`  
**URL:** `http://localhost:8080/cliente/1`

**Esperado (Se existe):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "João Lucas",
    "email": "joaolucaslimamaia@gmail.com",
    "telefone": "85982194601"
  },
  "message": "Cliente recuperado com sucesso"
}
```

---

## 3️⃣ **POST - Criar Novo Cliente**

**Método:** `POST`  
**URL:** `http://localhost:8080/cliente`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nome": "Maria Silva",
  "email": "maria.silva@email.com",
  "telefone": "85987654321"
}
```

**Esperado:**
```json
{
  "success": true,
  "data": { "id": 2 },
  "message": "Cliente criado com sucesso!"
}
```

**Erro (Email duplicado):**
```json
{
  "success": false,
  "message": "Email já cadastrado"
}
```

---

## 4️⃣ **PUT - Atualizar Cliente**

**Método:** `PUT`  
**URL:** `http://localhost:8080/cliente/1`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):** (envie só o que quer alterar)
```json
{
  "nome": "João Lucas Novo",
  "telefone": "85999999999"
}
```

**Esperado:**
```json
{
  "success": true,
  "data": { "id": 1 },
  "message": "Cliente atualizado com sucesso!"
}
```

---

## 5️⃣ **DELETE - Deletar Cliente**

**Método:** `DELETE`  
**URL:** `http://localhost:8080/cliente/1`

**Esperado:**
```json
{
  "success": true,
  "message": "Cliente deletado com sucesso!"
}
```

---

# 🍽️ RESTAURANTE

## 1️⃣ **GET - Listar Todos os Restaurantes**

**Método:** `GET`  
**URL:** `http://localhost:8080/restaurante`

**Esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Two Brothers",
      "descricao": "A MELHOR PIZZA DE FORTAL",
      "telefone": "85997760071",
      "preco": "$$$"
    }
  ],
  "message": "Lista de restaurantes"
}
```

---

## 2️⃣ **GET - Buscar Restaurante por ID**

**Método:** `GET`  
**URL:** `http://localhost:8080/restaurante/1`

**Esperado:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Two Brothers",
    "descricao": "A MELHOR PIZZA DE FORTAL",
    "telefone": "85997760071",
    "preco": "$$$"
  },
  "message": "Restaurante recuperado com sucesso"
}
```

---

## 3️⃣ **GET - Buscar Restaurantes por Faixa de Preço**

**Método:** `GET`  
**URL:** `http://localhost:8080/restaurante/preco/$`

**Preços válidos:** `$`, `$$`, `$$$`

**Esperado:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "nome": "Lanchonete Barato",
      "descricao": "Comida rápida e barata",
      "telefone": "85988888888",
      "preco": "$"
    }
  ],
  "message": "Restaurantes com preço $"
}
```

---

## 4️⃣ **POST - Criar Novo Restaurante**

**Método:** `POST`  
**URL:** `http://localhost:8080/restaurante`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nome": "Pizzaria Gourmet",
  "descricao": "Pizzas artesanais com ingredientes Premium",
  "telefone": "85999999999",
  "preco": "$$$"
}
```

**Preços disponíveis:**
- `$` - Barato
- `$$` - Médio
- `$$$` - Caro

**Esperado:**
```json
{
  "success": true,
  "data": { "id": 4 },
  "message": "Restaurante criado com sucesso!"
}
```

**Erro (Nome duplicado):**
```json
{
  "success": false,
  "message": "Restaurante com este nome já existe"
}
```

---

## 5️⃣ **PUT - Atualizar Restaurante**

**Método:** `PUT`  
**URL:** `http://localhost:8080/restaurante/1`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):** (envie só o que quer alterar)
```json
{
  "descricao": "A MELHOR PIZZA DO BRASIL",
  "preco": "$$"
}
```

**Esperado:**
```json
{
  "success": true,
  "data": { "id": 1 },
  "message": "Restaurante atualizado com sucesso!"
}
```

---

## 6️⃣ **DELETE - Deletar Restaurante**

**Método:** `DELETE`  
**URL:** `http://localhost:8080/restaurante/1`

**Esperado:**
```json
{
  "success": true,
  "message": "Restaurante deletado com sucesso!"
}
```

---

# 📦 PEDIDOS

---

## 1️⃣ **GET - Listar Todos os Pedidos**

**Método:** `GET`  
**URL:** `http://localhost:8080/pedido`

**Esperado:**
```json
{
  "success": true,
  "data": [
    {
      "idPedido": 1,
      "idCliente": 1,
      "status": "Pendente",
      "precoPedido": 50.00,
      "idRestaurante": 1,
      ...
    }
  ],
  "message": "Lista de pedidos "
}
```

---

## 2️⃣ **GET - Buscar Pedido por ID**

**Método:** `GET`  
**URL:** `http://localhost:8080/pedido/1`

**Esperado (Se o pedido existe):**
```json
{
  "success": true,
  "data": {
    "idPedido": 1,
    "idCliente": 1,
    "status": "Pendente",
    "precoPedido": 50.00,
    ...
  },
  "message": "Pedido recuperado com sucesso"
}
```

**Esperado (Se o pedido NÃO existe):**
```json
{
  "success": false,
  "data": null,
  "message": "Pedido não encontrado"
}
```

---

## 3️⃣ **GET - Buscar Pedidos por Usuário**

**Método:** `GET`  
**URL:** `http://localhost:8080/pedido/usuario/1`

**Esperado:**
```json
{
  "success": true,
  "data": [
    {
      "idPedido": 1,
      "idCliente": 1,
      "status": "Pendente",
      ...
    },
    {
      "idPedido": 2,
      "idCliente": 1,
      "status": "Entregue",
      ...
    }
  ],
  "message": "Pedidos do usuário recuperados com sucesso"
}
```

---

## 4️⃣ **POST - Criar Novo Pedido**

**Método:** `POST`  
**URL:** `http://localhost:8080/pedido`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "idCliente": 1,
  "idRestaurante": 1,
  "status": "Pendente",
  "precoPedido": 75.50,
  "idPagamento": 1,
  "idEntregador": 1,
  "idEnderecoCliente": 1,
  "inicioPedido": "2025-11-12 10:30:00",
  "fimPedido": null,
  "itens": [
    {
      "idItem": 1,
      "quantidade": 2,
      "precoUnitario": 25.00
    },
    {
      "idItem": 2,
      "quantidade": 1,
      "precoUnitario": 25.50
    }
  ]
}
```

**Esperado:**
```json
{
  "success": true,
  "data": { "id": 5 },
  "message": "Pedido criado com sucesso!"
}
```

**Erro (dados incompletos):**
```json
{
  "success": false,
  "message": "Dados incompletos. 'idCliente' e 'itens' são obrigatórios."
}
```

---

## 5️⃣ **PUT - Atualizar Status do Pedido**

**Método:** `PUT`  
**URL:** `http://localhost:8080/pedido/1`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "status": "Em preparo"
}
```

**Status válidos:**
- `Pendente`
- `Em preparo`
- `Saiu para entrega`
- `Entregue`
- `Cancelado`

**Esperado:**
```json
{
  "success": true,
  "data": { 
    "id": 1, 
    "newStatus": "Em preparo" 
  },
  "message": "Status do pedido atualizado com sucesso!"
}
```

**Erro (status inválido):**
```json
{
  "success": false,
  "message": "Status inválido. Use um dos: Pendente, Em preparo, Saiu para entrega, Entregue, Cancelado"
}
```

**Erro (pedido não existe):**
```json
{
  "success": false,
  "data": null,
  "message": "Pedido não encontrado com o ID fornecido."
}
```

---

## 📋 Ordem Recomendada de Testes

1. ✅ GET `/pedido` - Ver se existe algum pedido no banco
2. ✅ POST `/pedido` - Criar um novo pedido (anote o ID retornado)
3. ✅ GET `/pedido/:idPedido` - Buscar o pedido que criou (usar o ID do passo anterior)
4. ✅ PUT `/pedido/:idPedido` - Atualizar o status do pedido
5. ✅ GET `/pedido/usuario/:idUsuario` - Listar pedidos de um usuário específico

---

## 🔧 Dicas no Thunder Client

1. **Salvar Requisições:**
   - Clique em "Save" após configurar uma requisição
   - Organize em coleções (ex: "Pedidos")

2. **Usar Variáveis de Ambiente:**
   - Crie uma variável `baseUrl` = `http://localhost:8080`
   - Use `{{baseUrl}}/pedido` nas URLs

3. **Visualizar Respostas:**
   - JSON será formatado automaticamente
   - Clique em "Body" para ver a resposta
   - Clique em "Status" para ver o código HTTP

4. **Testar Erros:**
   - Tente com IDs que não existem
   - Tente com dados incompletos no POST
   - Tente com status inválido no PUT

---

## ✨ Exemplo Completo de Fluxo

```
1. GET http://localhost:8080/pedido
   → Ver pedidos existentes

2. POST http://localhost:8080/pedido
   {
     "idCliente": 5,
     "idRestaurante": 2,
     "precoPedido": 100.00,
     "idPagamento": 1,
     "idEntregador": 2,
     "idEnderecoCliente": 3,
     "itens": [
       {"idItem": 5, "quantidade": 3, "precoUnitario": 33.33}
     ]
   }
   → Recebe id: 10

3. GET http://localhost:8080/pedido/10
   → Confirma que o pedido foi criado

4. PUT http://localhost:8080/pedido/10
   {"status": "Em preparo"}
   → Atualiza status

5. PUT http://localhost:8080/pedido/10
   {"status": "Saiu para entrega"}
   → Atualiza status novamente
```
