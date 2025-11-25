# Arquitetura - AmbienteDeDados

## Diagrama de Fluxo Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                       🌐 NAVEGADOR (Frontend)                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  HTML (index.html)                                       │   │
│  │  - Layout de todas as páginas                           │   │
│  │  - Forms (login, register)                              │   │
│  │  - Listas dinâmicas (restaurantes, items, pedidos)     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  CSS (styles.css)                                        │   │
│  │  - Layout responsivo (mobile, tablet, desktop)          │   │
│  │  - Gradientes, animações, transitions                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  JavaScript (app.js)                                     │   │
│  │  - Navegação entre páginas                              │   │
│  │  - Autenticação (localStorage)                          │   │
│  │  - Cart (add/remove items)                              │   │
│  │  - API calls (fetch)                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  LocalStorage                                            │   │
│  │  - token (JWT)                                           │   │
│  │  - user (JSON)                                           │   │
│  │  - cart (JSON)                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
                    (HTTP + CORS)
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                   🖥️  SERVIDOR (Backend - Node.js)              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  index.js (Entry Point)                                  │   │
│  │  - Express app                                           │   │
│  │  - CORS middleware                                       │   │
│  │  - Route registration                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  src/routes/ (9 rotas)                                   │   │
│  │  - authRoutes.js                                         │   │
│  │  - clienteRoutes.js, restauranteRoutes.js              │   │
│  │  - itemRoutes.js, pagamentoRoutes.js                    │   │
│  │  - pedidoRoutes.js, enderecoRoutes.js                   │   │
│  │  - entregadorRoutes.js, horarioFuncionamentoRoutes.js   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  src/controllers/ (9 controllers)                        │   │
│  │  - Lógica de negócio                                     │   │
│  │  - Validações                                            │   │
│  │  - Hash de senhas (bcryptjs)                             │   │
│  │  - JWT generation                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  src/models/ (9 models)                                  │   │
│  │  - Queries SQL                                           │   │
│  │  - Acesso ao banco de dados (mysql2/promise)           │   │
│  │  - Funções de comparação (bcrypt)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  src/config/db.js                                        │   │
│  │  - Connection pool (mysql2/promise)                      │   │
│  │  - Teste de conexão                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
                         (TCP/IP)
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    🗄️  BANCO DE DADOS (MySQL)                   │
│                                                                   │
│  ├── cliente (id, nome, email, telefone, senha)                │
│  ├── restaurante (id, nome, descricao, endereco, preco)        │
│  ├── item (id, nome, descricao, preco, idRestaurante)         │
│  ├── pedido (id, idCliente, idRestaurante, dataCriacao)       │
│  ├── pedido_item (idPedido, idItem, quantidade)               │
│  ├── pagamento (id, tipo, descricao)                          │
│  ├── endereco (id, cep, rua, numero, cidade, idCliente)       │
│  ├── entregador (id, nome, email, telefone)                   │
│  └── horario_funcionamento (id, diaSemana, horarioAbertura, idRest)
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Fluxo de Autenticação

```
[User] → Registrar/Login (Frontend)
           ↓
       [Backend] POST /auth/register ou /auth/login
           ↓
       [Controller] Validar entrada, hash senha (bcryptjs)
           ↓
       [Model] INSERT/SELECT no MySQL
           ↓
       [Controller] Gerar JWT (jsonwebtoken)
           ↓
       [Frontend] Salva token em localStorage
           ↓
       [Requisições futuras] Headers incluem Authorization: Bearer <token>
```

## Fluxo de Pedido

```
[User] → Seleciona restaurante e items
           ↓
       [Frontend] Adiciona ao cart (localStorage)
           ↓
       [User] Clica "Finalizar Pedido"
           ↓
       [Frontend] POST /pedido com payload:
                  {
                    idCliente: <id>,
                    idRestaurante: <id>,
                    itens: [{idItem, quantidade}, ...]
                  }
           ↓
       [Backend] POST /pedido → pedidoController.create()
           ↓
       [Controller] Valida cliente e restaurante
           ↓
       [Model] BEGIN TRANSACTION
               INSERT INTO pedido
               INSERT INTO pedido_item (para cada item)
               COMMIT
           ↓
       [Frontend] Carrinho é limpo
           ↓
       [User] Vê o pedido em /perfil (GET /pedido/usuario/:id)
```

## Estrutura de Arquivos

```
ambienteDeDados/
│
├── node.js/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js (connection pool)
│   │   │
│   │   ├── controllers/ (9 arquivos)
│   │   │   ├── authController.js
│   │   │   ├── clienteController.js
│   │   │   ├── restauranteController.js
│   │   │   ├── itemController.js
│   │   │   ├── pedidoController.js
│   │   │   ├── pagamentoController.js
│   │   │   ├── enderecoController.js
│   │   │   ├── entregadorController.js
│   │   │   └── horarioFuncionamentoController.js
│   │   │
│   │   ├── models/ (9 arquivos)
│   │   │   ├── clienteModel.js
│   │   │   ├── restauranteModel.js
│   │   │   ├── itemModel.js
│   │   │   ├── pedidoModel.js
│   │   │   ├── pagamentoModel.js
│   │   │   ├── enderecoModel.js
│   │   │   ├── entregadorModel.js
│   │   │   └── horarioFuncionamentoModel.js
│   │   │
│   │   ├── routes/ (9 arquivos)
│   │   │   └── (correspondem aos models/controllers)
│   │   │
│   │   ├── scripts/
│   │   │   └── apply_migrations.js
│   │   │
│   │   └── docs/
│   │       ├── tabelas SQL/
│   │       ├── queries/
│   │       └── flowcharts/
│   │
│   ├── index.js (entry point)
│   ├── package.json
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── index.html (aplicação completa)
│   ├── app.js (lógica)
│   ├── styles.css (estilos)
│   ├── test.html (testes)
│   ├── README.md
│   ├── GUIA_USO.md
│   └── FRONTEND_DOCS.md
│
├── docs/
├── outrosdocs/
│
├── RESUMO_FINAL.md
├── QUICK_START.md
└── ARQUITETURA.md (este arquivo)
```

## Stack Tecnológico

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Banco:** MySQL (mysql2/promise)
- **Segurança:** bcryptjs (hashing), jsonwebtoken (JWT)
- **CORS:** cors package
- **ENV:** dotenv

### Frontend
- **HTML5** (sem template engine)
- **CSS3** (responsivo, gradientes)
- **JavaScript ES6+** (fetch, localStorage)
- **Sem dependências externas**

## Performance

### Frontend
- Carregamento: ~50KB total (HTML + CSS + JS)
- Sem build step → rápido para desenvolvimento
- Sem bundling → menos overhead

### Backend
- Connection pooling (evita criar conexão a cada query)
- Middleware CORS configurado
- Respostas padronizadas {success, data, message}

## Segurança

✅ Senhas hasheadas com bcryptjs (10 rounds)
✅ JWT com expiração de 24h
✅ CORS habilitado apenas para frontend autorizado
✅ Validações de entrada em controllers
✅ Tipo-safe em some places (campos obrigatórios)

⚠️ TODO:
- Middleware JWT para proteger rotas sensíveis
- Rate limiting em auth endpoints
- Validação de email (envio de confirmação)
- HTTPS em produção

---

**Arquitetura simples, escalável e fácil de manter!** 🎯

