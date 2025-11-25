Ambiente

- Base URL: http://localhost:8080
- Header padrão para requests com corpo JSON:
  - Content-Type: application/json

Observação sobre autenticação (importante)

- Atualmente o projeto gera um JWT no registro/login, mas a tabela `cliente` do banco não tem coluna `senha`. Por isso implementei uma solução temporária: o registro cria o cliente sem senha e o login aceita qualquer senha para gerar o token (apenas para permitir testes).
- Não use essa versão em produção. Quando quiser, eu implemento o fluxo seguro (adicionar coluna `senha`, bcryptjs, comparação segura, etc.).

Como usar no Thunder Client

Formato de cada item a seguir (copiar para Thunder Client -> New Request):
- Method: (ex: POST)
- URL: http://localhost:8080/<rota>
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer <token>  (quando quiser testar rotas protegidas no futuro)
- Body (raw JSON) quando aplicável

1) Autenticação

POST /auth/register
- Descrição: registra um cliente e retorna um JWT.
- Body (JSON) (exemplo):
{
  "nome": "Test Secure",
  "email": "test_secure@test.com",
  "telefone": "11999999999",
  "senha": "Senha123!"
}
- Resposta esperada (201):
  {
    "success": true,
    "data": { "id": <id>, "nome": "Test Secure", "email": "test_secure@test.com", "token": "<token>", "expiresIn": "24h" },
    "message": "Usuário registrado com sucesso!"
  }

POST /auth/login
- Descrição: faz login usando email + senha. Retorna JWT se as credenciais estiverem corretas.
- Body (JSON) (exemplo):
{
  "email": "test_secure@test.com",
  "senha": "Senha123!"
}
- Resposta esperada (200):
  {
    "success": true,
    "data": { "id": <id>, "nome": "Test Secure", "email": "test_secure@test.com", "token": "<token>", "expiresIn": "24h" },
    "message": "Login realizado com sucesso!"
  }

Test user (pré-criado durante testes)
- Email: `test_secure@test.com`
- Senha: `Senha123!`

Como copiar o token e usar no Thunder Client
- Após o `POST /auth/login` copie o valor do campo `data.token` da resposta.
- Crie ou abra uma request no Thunder Client e adicione o header:
  - Key: `Authorization`
  - Value: `Bearer <COLE_AQUI_O_TOKEN>`

Exemplo de header com token (use o token retornado pelo login):
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....

Observação: o token expira em 24 horas. Se o token expirar, execute `POST /auth/login` novamente para obter um novo token.

2) Cliente

GET /cliente
- Descrição: lista todos os clientes
- Exemplo: GET http://localhost:8080/cliente

GET /cliente/:id
- Descrição: buscar cliente por ID
- Exemplo: GET http://localhost:8080/cliente/1

POST /cliente
- Descrição: cria cliente (sem senha na tabela atual)
- Body:
{
  "nome": "Ana Pereira",
  "email": "ana@test.com",
  "telefone": "11988887777"
}

PUT /cliente/:id
- Descrição: atualiza cliente
- Body (exemplo):
{
  "nome": "Ana P.",
  "email": "ana@test.com",
  "telefone": "11988887777"
}

DELETE /cliente/:id
- Descrição: remove cliente
- Exemplo: DELETE http://localhost:8080/cliente/3

3) Restaurante

GET /restaurante
- Lista todos os restaurantes

GET /restaurante/preco/:preco
- Filtra por faixa de preço. Valores válidos: $, $$, $$$
- Exemplo: GET /restaurante/preco/$$

GET /restaurante/:id
- Buscar por ID

POST /restaurante
- Criar novo restaurante
- Body (exemplo):
{
  "nome": "Restaurante Bom Sabor",
  "descricao": "Comida caseira",
  "preco": "$$"
}

PUT /restaurante/:id
- Atualizar

DELETE /restaurante/:id
- Deletar

4) Pagamento

GET /pagamento
GET /pagamento/:id
POST /pagamento
- Body (ex): { "nome": "Cartão" }
PUT /pagamento/:id
DELETE /pagamento/:id

5) Entregador

GET /entregador
GET /entregador/status/:status
- status exemplo: ativo, inativo, Em entrega
GET /entregador/:id
POST /entregador
- Body exemplo:
{
  "nome": "Carlos",
  "telefone": "11977776666",
  "cpf": "12345678900",
  "placaMoto": "ABC-1234",
  "cnh": "X1234567",
  "status": "ativo"
}
PUT /entregador/:id
DELETE /entregador/:id

6) Item

GET /item
GET /item/tipo/:idTipo
GET /item/:id
POST /item
- Body exemplo:
{
  "nome": "Hambúrguer",
  "descricao": "Delicioso",
  "preco": 25.5,
  "idRestaurante": 1,
  "idTipo": 1
}
PUT /item/:id
DELETE /item/:id

7) Horário de Funcionamento

GET /horario
GET /horario/:id
POST /horario
- Body exemplo:
{
  "idRestaurante": 1,
  "diaSemana": "Segunda",
  "horaAbertura": "09:00",
  "horaFechamento": "18:00"
}
PUT /horario/:id
DELETE /horario/:id

Observação: o controller valida `diaSemana` entre: Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo.

8) Endereço

GET /endereco
GET /endereco/cliente/:idCliente
GET /endereco/restaurante/:idRestaurante
GET /endereco/:id
POST /endereco
- Body exemplo (para cliente):
{
  "idCliente": 1,
  "logradouro": "Rua A",
  "numero": "123",
  "complemento": "ap 12",
  "bairro": "Centro",
  "cidade": "Fortaleza",
  "estado": "CE",
  "cep": "60000-000",
  "referencia": "Perto do mercado",
  "tipo": "Residencial"
}
PUT /endereco/:id
DELETE /endereco/:id

Notas de uso do Thunder Client

- Para testar registro/login primeiro faça POST /auth/register para obter token no campo `data.token`.
- Apesar do token atual ser gerado, as rotas não exigem verificação automática; se quiser testar um cenário futuro, inclua o header:
  Authorization: Bearer <token>

Principais funcionalidades aplicadas e decisões de implementação

- Arquitetura MVC: separação clara entre `models/` (acesso a dados), `controller/` (validações e regras de negócio) e `routes/` (mapeamento HTTP).
- Validações no controller: campos obrigatórios validados, formatos básicos (ex.: email) e enums validados (preço, dia da semana, status de entregador, tipo de endereço).
- Banco: uso de `mysql2/promise` com pool (arquivo `config/db.js`).
- Prevenção de duplicatas: checagens no controller/model (ex.: email para cliente, cpf para entregador, nome para pagamento) retornando 409 Conflict quando aplicável.
- Endereço: suporta endereços ligados a cliente OU restaurante (um dos dois pode ser null) — criado `models/enderecoModel.js` e `controller/enderecoController.js`.
- Horário: valida dia da semana e armazena horário de abertura/fechamento.
- Itens: endpoints para filtrar por tipo e referência a restaurante via FK.
- Pedido: implementação existente com transação (criação de pedido e itens em transação) — mantenha atenção ao uso correto de `pool`.
- Auth: JWT gerado no register/login; por enquanto sem persistência de senha (solução temporária para facilitar testes). Futuro passo recomendado: adicionar coluna `senha`, usar `bcryptjs` para hash e comparar durante login.

Sugestões para próximos passos (se quiser que eu aplique)

- Implementar senha segura:
  - Adicionar coluna `senha` ao `cliente` (VARCHAR(255)).
  - Instalar e usar `bcryptjs` para gerar hashes.
  - Atualizar `ClienteModel.create` para inserir `senha` e `authController` para comparar hash no login.
- Proteger rotas sensíveis com middleware que valide JWT.
- Adicionar scripts SQL de migração em `docs/queries`.

Fim do documento.
