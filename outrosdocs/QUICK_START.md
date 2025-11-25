# Comandos Rápidos - AmbienteDeDados

## Terminal 1: Backend

```powershell
cd c:\Users\Nicolas\Documents\GitHub\ambienteDeDados\node.js
node index.js
```

**Esperado:**
```
API em dev ouvindo na porta 8080
✅ Conexão ao MySQL estabelecida com sucesso!
```

## Terminal 2: Frontend

### Opção A: Python (Recomendado)
```powershell
cd c:\Users\Nicolas\Documents\GitHub\ambienteDeDados\frontend
python -m http.server 8000
```

Depois acesse: `http://localhost:8000`

### Opção B: Node.js (live-server)
```powershell
cd c:\Users\Nicolas\Documents\GitHub\ambienteDeDados\frontend
npx live-server
```

Abre automaticamente em `http://localhost:8080`

## Teste Rápido de Integração

1. Abra o arquivo `frontend/test.html` no navegador (pode ser local ou via servidor)
2. Use os botões para testar:
   - Conexão
   - Listar restaurantes
   - Registrar novo usuário
   - Fazer login

## Fluxo Manual de Teste

1. **Abra** `http://localhost:8000` (frontend)
2. **Clique** em "Registrar" e crie um novo usuário:
   - Nome: `Teste`
   - Email: `teste@test.com`
   - Telefone: `11987654321`
   - Senha: `Senha123!`
3. **Clique** em um restaurante para ver cardápio
4. **Adicione** 2-3 itens ao carrinho
5. **Vá** ao carrinho (ícone 🛒)
6. **Finalize** o pedido clicando "Finalizar Pedido"
7. **Veja** seu pedido em "Perfil"

## Limpar Cache Local

Se encontrar erros, limpe o localStorage:

No console do navegador (F12):
```javascript
localStorage.clear()
location.reload()
```

## Verificar Logs

### Backend
- Veja no terminal onde está rodando `node index.js`

### Frontend
- Abra DevTools (F12) → Console para ver erros JavaScript

### Requisições HTTP
- DevTools → Network para ver requisições e respostas da API

## URLs Importantes

- **Frontend:** `http://localhost:8000`
- **Backend API:** `http://localhost:8080`
- **Teste de Integração:** `http://localhost:8000/test.html`

---

**Tudo pronto?** Comece pelo Terminal 1, depois Terminal 2, e acesse o frontend! 🚀

