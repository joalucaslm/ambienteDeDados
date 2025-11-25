
# Frontend — Como a aplicação funciona (guia + testes)

Este documento descreve os principais fluxos do frontend, como testar localmente e exemplos de payloads/ações.

Pré-requisitos
- Backend rodando em `http://localhost:8080` (porta padrão do projeto).
- Node.js e npm instalados.

Iniciar o frontend

```powershell
cd frontend
npm install
npm run dev
```

Estrutura principal
- `src/api/client.js` — instância Axios com `baseURL` apontando para o backend. Adiciona automaticamente o header `Authorization: Bearer <token>` quando um token estiver salvo em `localStorage`.
- `src/contexts/AuthContext.jsx` — controla autenticação, token em `localStorage`, e fornece `register`, `login`, `logout` e `user` ao app.
- `src/contexts/CartContext.jsx` — gerencia itens do carrinho e persiste em `localStorage`.
- `src/pages` — páginas principais: `Login`, `Register`, `Restaurants`, `RestaurantDetail`, `Cart`, `Profile`.
- `src/components/ProtectedRoute.jsx` — componente para proteger rotas que exigem autenticação.

Fluxos principais e exemplos de teste

1) Registro
- Página: `/register`
- Campos: `nome`, `email`, `telefone`, `senha`
- Ação: ao submeter, o frontend chama `POST /auth/register` com o payload abaixo.

Exemplo de payload (JSON):
{
  "nome": "Teste Front",
  "email": "teste_front@example.com",
  "telefone": "11999998888",
  "senha": "Senha123!"
}

Resultado esperado: resposta com `data.token` (JWT) e redirecionamento para `/`.

2) Login
- Página: `/login`
- Campos: `email`, `senha`
- Ação: POST `/auth/login` com
{
  "email": "teste_front@example.com",
  "senha": "Senha123!"
}

Resultado: token salvo em `localStorage` e `user` no contexto.

3) Ver restaurantes
- Página: `/` (Home)
- Ação: `GET /restaurante` — a lista é exibida.
- Clique em um restaurante para ver `/restaurante/:id`.

4) Ver cardápio e adicionar ao carrinho
- `RestaurantDetail` faz `GET /restaurante/:id` e `GET /item` (filtro client-side por `idRestaurante`).
- Ao clicar em "Adicionar" o item é salvo no `CartContext` e persistido.

5) Carrinho e Checkout
- Página: `/cart` (protegida)
- Checkout cria pedido chamando `POST /pedido` com payload:
{
  "idCliente": <id do usuário>,
  "idRestaurante": <id do restaurante>,
  "idPagamento": null,
  "itens": [ { "idItem": 1, "quantidade": 2 }, ... ]
}

Resposta esperada: criação do pedido com sucesso; frontend limpa o carrinho.

6) Perfil e Pedidos
- Página: `/profile` (protegida)
- O componente chama `GET /pedido/usuario/:idUsuario` usando o `user.id` do contexto.
- Exibe lista de pedidos retornados. Se o backend devolver campos com nomes diferentes, a página faz tentativas de leitura (`p.itens` ou `p.pedidoItems`, `p.createdAt` ou `p.data`).

Testes manuais recomendados (passo a passo)
1. Inicie backend (porta 8080) e frontend (`npm run dev`).
2. Acesse `http://localhost:5173` (ou URL fornecida pelo Vite).
3. Registrar novo usuário em `/register`.
4. Verificar que foi redirecionado e token salvo (abra DevTools → Application → Local Storage).
5. Ir à página de restaurantes `/`, selecionar um restaurante e adicionar 1-2 itens ao carrinho.
6. Ir a `/cart` e clicar em "Finalizar pedido". Confirme no backend se o pedido foi criado (via DB ou Thunder Client).
7. Ir a `/profile` e verificar se o pedido aparece listado.

Solução de problemas comuns
- Erro CORS / API não alcançável: confirme que o backend está rodando e aceita requisições de `localhost:5173` (ver cabeçalhos CORS no servidor).
- Token não sendo enviado: verifique `localStorage.token` e se `src/api/client.js` interceptor está presente.
- Campos divergentes: o frontend tenta mapear distintos nomes de campos retornados pelo backend; se seu backend usa outras chaves, ajuste `Profile.jsx` e `RestaurantDetail.jsx` conforme necessário.

Endpoint quick-reference (frontend utiliza esses):
- `POST /auth/register` — register
- `POST /auth/login` — login
- `GET /restaurante` — lista restaurantes
- `GET /restaurante/:id` — detalhe restaurante
- `GET /item` — lista itens (filtragem no cliente)
- `POST /pedido` — criar pedido
- `GET /pedido/usuario/:idUsuario` — pedidos do usuário

Se quiser, eu posso:
- Adicionar testes automatizados (Cypress / Playwright) com um cenário de registro → compra → ver pedido.
- Melhorar o layout e responsividade.
- Proteger endpoints no backend (middleware JWT) e ajustar mensagens de erro para melhor UX.

