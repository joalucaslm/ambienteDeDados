// --- navigation.js ---
// Este script lida com a lógica de navegação e eventos de clique em todo o site.

document.addEventListener('DOMContentLoaded', () => {
    const pagePath = window.location.pathname;

    // Função auxiliar para fazer chamadas de API
    async function apiFetch(url, options) {
        try {
            const response = await fetch(`http://localhost:3000${url}`, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Fetch Error:', error);
            alert(`Erro na comunicação com o servidor: ${error.message}`);
            return null;
        }
    }

    // --- LÓGICA PARA PÁGINA DE LOGIN DE CLIENTE (index.html ou TeladeLogin.html) ---
    if (pagePath.endsWith('index.html') || pagePath.endsWith('TeladeLogin.html')) {
        const loginForm = document.querySelector('form'); // Assumindo que há apenas um formulário
        const emailInput = document.querySelector('input[placeholder*="e-mail"]');
        const passwordInput = document.querySelector('input[type="password"]');
        const loginButton = document.querySelector('button.bg-primary');

        if (loginButton) {
            loginButton.addEventListener('click', async (e) => {
                e.preventDefault();
                const email = emailInput.value;
                const password = passwordInput.value;

                if (!email || !password) {
                    return alert('Por favor, preencha e-mail e senha.');
                }
                
                // Adicionado para simular um login bem-sucedido sem backend real
                console.warn('Simulando login de CLIENTE. Remova esta linha para usar o backend.');
                localStorage.setItem('usuarioLogado', JSON.stringify({ email: email, name: 'Usuário Simulado', id: 1, token: 'fake-token-cliente' }));
                window.location.href = 'cliente/HomeCliente.html';

                /*
                // CÓDIGO PARA USAR COM BACKEND REAL
                const data = await apiFetch('/auth/login/cliente', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (data && data.token) {
                    localStorage.setItem('usuarioLogado', JSON.stringify(data));
                    window.location.href = 'cliente/HomeCliente.html';
                } else {
                    alert('Falha no login. Verifique suas credenciais.');
                }
                */
            });
        }
    }

    // --- LÓGICA PARA PÁGINA DE LOGIN DE RESTAURANTE (LoginRestaurante.html) ---
    if (pagePath.endsWith('LoginRestaurante.html')) {
        const loginForm = document.querySelector('form');
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');
        const loginButton = document.querySelector('button.bg-primary');

        if (loginButton) {
            loginButton.addEventListener('click', async (e) => {
                e.preventDefault();
                const identificador = emailInput.value; // Pode ser email ou CNPJ
                const password = passwordInput.value;

                if (!identificador || !password) {
                    return alert('Por favor, preencha o identificador e a senha.');
                }
                
                // Adicionado para simular um login bem-sucedido sem backend real
                console.warn('Simulando login de RESTAURANTE. Remova esta linha para usar o backend.');
                localStorage.setItem('restauranteLogado', JSON.stringify({ nome: 'Restaurante Simulado', id: 1, token: 'fake-token-restaurante' }));
                window.location.href = 'admin/DashBoardRestaurantes.html';
                
                /*
                // CÓDIGO PARA USAR COM BACKEND REAL
                const data = await apiFetch('/auth/login/restaurante', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identificador, password })
                });

                if (data && data.token) {
                    localStorage.setItem('restauranteLogado', JSON.stringify(data));
                    window.location.href = 'admin/DashBoardRestaurantes.html';
                } else {
                    alert('Falha no login. Verifique suas credenciais.');
                }
                */
            });
        }
    }

    // --- LÓGICA PARA HOME DE CLIENTE (HomeCliente.html) ---
    if (pagePath.endsWith('HomeCliente.html')) {
        const restaurantCards = document.querySelectorAll('.grid > div.p-4'); // Seleciona os cards de restaurante
        restaurantCards.forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                // Como o ID não está no HTML, estamos usando um ID simulado (index + 1)
                const restauranteId = index + 1; 
                console.log(`Card clicado. Redirecionando para cardápio do restaurante com ID: ${restauranteId}`);
                window.location.href = `CardapioExemplo.html?id=${restauranteId}`;
            });
        });

        // Link para "Meus Pedidos" e Logout
        const profileButton = document.querySelector('header button');
        if (profileButton) {
            // Apenas para exemplo, um clique longo faz logout, um clique normal iria para o perfil.
            profileButton.addEventListener('click', () => window.location.href = 'MeuPedidosCliente.html');
            profileButton.addEventListener('dblclick', () => fazerLogout()); // Usa a função global do auth-guard
            profileButton.title = "Clique para ver seus pedidos, clique duplo para sair.";
        }
    }

    // --- LÓGICA PARA CARDÁPIO (CardapioExemplo.html) ---
    if (pagePath.endsWith('CardapioExemplo.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const restauranteId = urlParams.get('id');
        console.log(`Carregando cardápio para o restaurante ID: ${restauranteId}`);
        // Aqui você faria um fetch para carregar os dados do cardápio usando o restauranteId

        const viewCartButton = document.querySelector('footer button');
        if(viewCartButton) {
            viewCartButton.addEventListener('click', () => {
                window.location.href = 'Carrinho.html';
            });
        }
    }

    // --- LÓGICA PARA CARRINHO (Carrinho.html) ---
    if (pagePath.endsWith('Carrinho.html')) {
        const checkoutButton = document.querySelector('footer button');
        const backButton = document.querySelector('main button');

        if(checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                const cart = [{ itemId: 1, quantity: 2 }]; // Exemplo de carrinho
                console.log('Finalizando pedido...', cart);
                // Aqui você faria o POST para /pedidos
                alert('Pedido finalizado com sucesso! (simulação)');
                localStorage.removeItem('carrinho');
                window.location.href = 'MeuPedidosCliente.html';
            });
        }
        if(backButton) {
            backButton.addEventListener('click', () => history.back());
        }
    }

});
