# Frontend - AmbienteDeDados

Frontend minimalista em HTML, CSS e JavaScript vanilla para a aplicação de food delivery.

## Estrutura

- `index.html` — página principal com todos os formulários e páginas
- `app.js` — toda a lógica da aplicação (auth, cart, API calls)
- `styles.css` — estilos e responsividade

## Como Rodar

1. Certifique-se de que o backend está rodando em `http://localhost:8080`
2. Abra o arquivo `index.html` no navegador (ou use um servidor local):

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (live-server)
npx live-server
```

3. Acesse `http://localhost:8000` (ou a porta configurada)

## Fluxos Principais

### Autenticação
- **Registrar**: preenchedor form com nome, email, telefone e senha. Token é salvo em `localStorage`.
- **Login**: insira email e senha para obter token JWT.
- **Logout**: limpa token e dados de carrinho.

### Restaurantes e Cardápio
- Home mostra lista de restaurantes (GET `/restaurante`)
- Ao clicar em um restaurante, vê os itens do cardápio (GET `/item` com filtragem client-side)

### Carrinho
- Adicione itens ao clicar em "Adicionar ao Carrinho"
- Carrinho é persistido em `localStorage`
- Veja o carrinho em `/cart` e remova itens

### Checkout
- Finalize o pedido clicando em "Finalizar Pedido" (POST `/pedido`)
- Requer autenticação

### Perfil e Pedidos
- Veja seu perfil e lista de pedidos (GET `/pedido/usuario/:idUsuario`)
- Requer autenticação

## Configuração

Altere a URL da API em `app.js`:

```javascript
const API_URL = 'http://localhost:8080'; // mude aqui se necessário
```

## Dependências

Nenhuma — apenas HTML, CSS e JavaScript vanilla!

