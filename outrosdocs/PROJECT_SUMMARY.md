# Projeto: ambienteDeDados — Resumo e Conexões (implementações feitas)

## Visão geral
Este documento descreve tudo o que foi implementado no branch `node.js-dev` do projeto `ambienteDeDados`, como os componentes se conectam, como testar localmente e quais limitações/pendências existem atualmente. Ele foi criado para você (trabalho de faculdade) e foca em clareza, passos para teste e próximos passos recomendados.

## Arquitetura
- Node.js + Express como servidor HTTP.
- MySQL (mysql2/promise) com pool de conexões (`config/db.js`).
- Padrão MVC: `models/` (acesso a dados), `controller/` (validações e regras), `routes/` (mapa HTTP).
- Autenticação via JWT (`jsonwebtoken`) — atualmente em modo temporário (veja seção "Autenticação").

## Estrutura principal (pastas importantes)
- `config/db.js` — cria pool de conexões e exporta `pool` e `testConnection()`.
- `models/` — modelos que executam queries SQL (ex.: `clienteModel.js`, `restauranteModel.js`, `enderecoModel.js`, `horarioFuncionamentoModel.js`, `itemModel.js`, `pagamentoModel.js`, `entregadorModel.js`, `pedidoModel.js`).
- `controller/` — validações e regras (ex.: `clienteController.js`, `restauranteController.js`, `authController.js`, `enderecoController.js`, `horarioFuncionamentoController.js`).
- `routes/` — define endpoints e conecta controllers (ex.: `clienteRoutes.js`, `restauranteRoutes.js`, `authRoutes.js`, `enderecoRoutes.js`, `horarioFuncionamentoRoutes.js`).
- `index.js` — ponto de entrada; registra middlewares, rotas e chama `testConnection()`.
- `outrosdocs/THUNDER_CLIENT_REQUESTS_COMPLETE.md` — coleção com exemplos de requests para usar no Thunder Client.

## O que foi implementado (resumo por entidade)
- Cliente: Model, Controller, Routes (CRUD). Validação de email duplicado.
- Restaurante: Model, Controller, Routes (CRUD). Validação de ENUM `preco` (`$`, `$$`, `$$$`), busca por faixa de preço. Validação de nome único.
- Pagamento: Model, Controller, Routes (CRUD).
- Entregador: Model, Controller, Routes (CRUD). Validação de CPF único e status.
- Item: Model, Controller, Routes (CRUD). Busca por tipo e por restaurante.
- Horário de Funcionamento: Model, Controller, Routes (CRUD). Validação de `diaSemana` (Segunda..Domingo).
- Endereço: Model, Controller, Routes (CRUD). Suporta endereço atrelado a `cliente` OU a `restaurante`.
- Pedido: já existia (implementado com transação para criar pedido + pedido_items).
- Autenticação: `controller/authController.js` e `routes/authRoutes.js` criados — geram JWT no register/login. OBS: atualmente o fluxo é temporário (não está persistindo/validando senha, ver seção "Limitações").

## Como tudo se conecta (fluxo de uma requisição)
1. Cliente (Thunder Client / navegador / curl) faz uma requisição HTTP para `http://localhost:8080/<rota>`.
2. O Express mapeia a rota em `routes/<X>Routes.js` e chama a função apropriada do controller.
3. O controller valida parâmetros/entrada e chama o model correspondente (`models/<X>Model.js`) para consultar/inserir/atualizar no banco via `pool.query()`.
4. O model executa a query e retorna resultado ao controller.
5. O controller monta o JSON de resposta no formato padronizado:
```json
{ "success": boolean, "data": object|null|array, "message": string }
```
6. Para autenticação: o `authController` gera um token JWT com `jwt.sign(payload, process.env.SECRET_KEY || 'sua_chave_secreta_aqui')` e retorna no campo `data.token`.

## Endpoints principais (lista rápida)
- Autenticação
  - POST /auth/register
  - POST /auth/login

- Cliente
  - GET /cliente
  - GET /cliente/:id
  - POST /cliente
  - PUT /cliente/:id
  - DELETE /cliente/:id

- Restaurante
  - GET /restaurante
  - GET /restaurante/preco/:preco
  - GET /restaurante/:id
  - POST /restaurante
  - PUT /restaurante/:id
  - DELETE /restaurante/:id

- Pagamento, Entregador, Item, Horário, Endereço, Pedido — cada um possui as rotas CRUD padrão e endpoints especiais (ver `routes/*.js` ou `outrosdocs/THUNDER_CLIENT_REQUESTS_COMPLETE.md`).

## Ponto importante — limitações atuais
1. Autenticação: a tabela `cliente` originalmente não tem coluna `senha`. Para permitir que você continue testando sem alterar o banco, o `authController` foi ajustado para:
   - Não exigir `senha` no register (apenas `nome`, `email`, `telefone`).
   - No login, verificar que o email existe e, **nesta versão de testes**, aceitar qualquer `senha` (apenas para gerar o token).
   - Observação: isso é inseguro; só use para testes locais/academia.

2. Tipo da coluna `telefone` no banco (CAUSA DE ERROS):
   - No banco atual, `telefone` é INT e pode causar `Out of range` quando você envia números com 11 dígitos (ex.: 11999999999 > 2.147.483.647).
   - Workaround atual: enviar um telefone numérico menor (≤ 2147483647), ou alterar o schema para `VARCHAR(20)` (recomendado). Não alteramos nada sem sua confirmação.

3. Tipo da coluna `preco`/`telefone` em outras tabelas: alguns schemas do banco podem ter tipos diferentes do que o código espera. Quando detectar erros SQL, rodar `DESCRIBE <tabela>` ajuda a identificar mismatch.

## Como rodar o servidor localmente
1. Certifique-se que MySQL está rodando e o banco `ambientededados` acessível com credenciais no `.env` (o projeto usa `process.env.DB_*`).
2. Na pasta `node.js`, instale dependências (se necessário):
```powershell
npm install
```
3. Inicie o servidor (nodemon ou node):
```powershell
# Com nodemon (se instalado globalmente ou em devDependencies)
npx nodemon index.js
# Ou com node
node index.js
```
4. O server imprime no console `API em <env> ouvindo na porta <PORT>` e chama `testConnection()` para verificar a conexão com MySQL.

## Como testar (exemplos rápidos)
- Registrar (usando telefone numérico pequeno por causa do INT):
```http
POST http://localhost:8080/auth/register
Content-Type: application/json

{ "nome": "Maria Silva", "email": "maria@test.com", "telefone": 119999999 }
```
- Login (qualquer senha nesta versão):
```http
POST http://localhost:8080/auth/login
Content-Type: application/json

{ "email": "maria@test.com", "senha": "qualquercoisa" }
```
- Criar restaurante (preço deve ser `$`, `$$` ou `$$$`):
```http
POST http://localhost:8080/restaurante
Content-Type: application/json

{ "nome": "Pizzaria Nova", "descricao": "Pizzas artesanais", "telefone": 85997760071, "preco": "$$$" }
```
> Atenção: se o `telefone` do restaurante for `INT` no banco, envie número compatível com INT, caso contrário aplique alteração no schema.

## Documentação de testes (Thunder Client)
- Existe o arquivo: `outrosdocs/THUNDER_CLIENT_REQUESTS_COMPLETE.md` com exemplos copy-paste para cada endpoint e bodies JSON prontos.

## Arquivos criados/alterados mais relevantes (lista)
- criado: `models/enderecoModel.js`, `models/horarioFuncionamentoModel.js`, `models/itemModel.js`, `models/pagamentoModel.js`, `models/entregadorModel.js`, `models/restauranteModel.js`, `models/clienteModel.js` (alguns já existiam)
- criado: `controller/enderecoController.js`, `controller/horarioFuncionamentoController.js`, `controller/itemController.js`, `controller/pagamentoController.js`, `controller/entregadorController.js`, `controller/restauranteController.js`, `controller/clienteController.js`, `controller/authController.js`
- criado: `routes/enderecoRoutes.js`, `routes/horarioFuncionamentoRoutes.js`, `routes/itemRoutes.js`, `routes/pagamentoRoutes.js`, `routes/entregadorRoutes.js`, `routes/restauranteRoutes.js`, `routes/clienteRoutes.js`, `routes/authRoutes.js`
- modificado: `index.js` (registro de novas rotas)
- criado: `outrosdocs/THUNDER_CLIENT_REQUESTS_COMPLETE.md` (coleção de requests)
- criado: `outrosdocs/PROJECT_SUMMARY.md` (este arquivo)

## Próximos passos recomendados (priorizados)
1. Converter `telefone` para `VARCHAR(20)` no banco (gerar script SQL / aplicar ALTER TABLE).
2. Implementar autenticação segura:
   - Adicionar coluna `senha` VARCHAR(255) no banco;
   - Instalar `bcryptjs` e atualizar `ClienteModel` e `authController` para armazenar hash/compartilhar hash;
   - Validar senha com `bcrypt.compare` no login.
3. Criar middleware JWT e proteger rotas sensíveis (ex.: criação/alteração/exclusão de pedidos, endereços).
4. Adicionar scripts SQL de migração em `docs/queries` para versionamento das alterações.

## Observações finais
- Tudo foi implementado com foco em clareza didática: controllers contêm validações e mensagens claras; models usam `pool.query()` com parâmetros para evitar SQL injection; responses seguem padrão `{ success, data, message }`.
- Se quiser, eu posso:
  - (A) Gerar e aplicar as migrações SQL para ajustar tipos (`telefone`/`preco`), atualizar código e testar automaticamente.
  - (B) Implementar autenticação segura (bcrypt + persistência de senha) e proteger rotas.
  - (C) Executar a suíte de testes manuais (Thunder Client) e gravar os responses em `outrosdocs/test-responses.md`.

---
Arquivo gerado automaticamente com base no estado atual do repositório.
