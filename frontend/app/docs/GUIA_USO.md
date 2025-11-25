# Guia de Uso - Frontend Vanilla AmbienteDeDados

## 📋 Resumo

O frontend foi refatorado para **HTML, CSS e JavaScript vanilla** — sem React, sem build step, apenas HTML puro e JS.

**Arquivos:**
- `index.html` — aplicação completa (todas as páginas em um único arquivo)
- `app.js` — lógica da aplicação (autenticação, API calls, cart, etc.)
- `styles.css` — estilos e responsividade
- `test.html` — testes rápidos de integração (opcional)

## 🚀 Como Rodar

### Pré-requisitos
- Backend rodando em `http://localhost:8080`
- Um navegador moderno
- Um servidor HTTP local (pode usar Python, Node.js, ou qualquer ferramenta)

### Opção 1: Usando Python
```bash
cd frontend
python -m http.server 8000
# Acesse http://localhost:8000
```

### Opção 2: Usando Node.js (live-server)
```bash
cd frontend
npx live-server
# Abre automaticamente em http://localhost:8080 (porta padrão)
```

### Opção 3: Abrir diretamente no navegador
Se tiver um servidor CORS configurado, basta abrir `frontend/index.html` diretamente no navegador (mas recomendamos usar um servidor local para evitar problemas de CORS).

## 🧪 Testar Integração

Abra `test.html` no navegador para realizar testes rápidos de conexão, registro e login antes de usar a app completa.

## 📱 Fluxo de Uso

### 1️⃣ **Início (Home)**
- Lista todos os restaurantes (GET `/restaurante`)
- Clique em um restaurante para ver o cardápio

### 2️⃣ **Registrar / Login**
- Clique em "Registrar" ou "Login" no cabeçalho
- Após autenticação bem-sucedida, token é salvo em `localStorage`
- Cabeçalho muda para exibir nome do usuário e botão "Sair"

### 3️⃣ **Restaurante e Cardápio**
- Ao selecionar um restaurante, vê lista de itens
- Clique em "Adicionar ao Carrinho" para cada item
- Quantidade de itens no carrinho é exibida no cabeçalho

### 4️⃣ **Carrinho**
- Veja todos os itens adicionados
- Remova itens se necessário
- Total é calculado automaticamente
- Botão "Finalizar Pedido" aparece apenas se estiver autenticado

### 5️⃣ **Checkout**
- Ao clicar em "Finalizar Pedido", envia POST para `/pedido` com:
  - `idCliente` (seu ID do token)
  - `idRestaurante` (restaurante do primeiro item)
  - `itens` (array com `idItem` e `quantidade`)
- Carrinho é limpo após sucesso
- Você é redirecionado para **Perfil**

### 6️⃣ **Perfil**
- Mostra suas informações (nome, email)
- Lista todos os seus pedidos (GET `/pedido/usuario/:idUsuario`)
- Para cada pedido, exibe: ID, status, data e restaurante

## 💾 Persistência

### LocalStorage
- **Token:** salvo em `localStorage.token`
- **Usuário:** salvo em `localStorage.user` (JSON)
- **Carrinho:** salvo em `localStorage.cart` (JSON)

Se fechar o navegador, os dados são recuperados automaticamente ao reabrir.

## ⚙️ Configuração

Se o backend estiver rodando em outra porta/host, altere em `app.js`:

```javascript
const API_URL = 'http://localhost:8080'; // Mude aqui
```

## 🔐 Autenticação

- Todos os requests incluem automaticamente o header `Authorization: Bearer <token>` (quando disponível)
- Rotas protegidas (carrinho, perfil, checkout) exigem token válido
- Se token expirar, você será redirecionado para login

## 📊 Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register` | Registrar novo usuário |
| POST | `/auth/login` | Fazer login |
| GET | `/restaurante` | Listar restaurantes |
| GET | `/restaurante/:id` | Detalhe do restaurante |
| GET | `/item` | Listar itens (filtragem client-side) |
| POST | `/pedido` | Criar pedido |
| GET | `/pedido/usuario/:id` | Pedidos do usuário |

## 🐛 Solução de Problemas

### "Access to XMLHttpRequest has been blocked by CORS"
- Verifique se o backend tem CORS habilitado (`cors` package)
- Confirme que o backend está rodando em `http://localhost:8080`

### Token não sendo enviado
- Verifique se você fez login com sucesso
- Abra DevTools (F12) → Application → LocalStorage e confirme `token` está lá

### Carrinho não persiste após recarregar
- Verifique em DevTools → Application → LocalStorage se `cart` está salvo como JSON

### Restaurante não carrega itens
- Verifique se o ID do restaurante existe no banco de dados
- Abra o console (F12) e procure por erros

## 📝 Exemplo de Uso Completo

1. **Registre um novo usuário:**
   - Nome: "João Silva"
   - Email: "joao@email.com"
   - Telefone: "11987654321"
   - Senha: "Senha123!"

2. **Selecione um restaurante** e adicione 2-3 itens ao carrinho

3. **Vá para o carrinho** e verifique o total

4. **Finalize o pedido** — você deve receber confirmação

5. **Abra seu Perfil** para ver o pedido criado

## 🎨 Layout

O layout é **responsivo** — funciona bem em:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (até 767px)

Tela muda para uma coluna em mobile.

## 💡 Dicas

- Use o arquivo `test.html` para testar rapidamente
- Sempre limpe o `localStorage` se encontrar erros persistentes (DevTools → Application → Clear storage)
- Se mudar a URL da API, certifique-se de que o backend está rodando lá
- O frontend é totalmente independente — você pode servir via qualquer servidor HTTP

---

Pronto! Divirta-se com o app 🍽️

