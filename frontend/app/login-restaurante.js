document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggleBtn = document.querySelector('button[type="button"]');
    const passwordToggleIcon = passwordToggleBtn.querySelector('span');

    // 1. Toggle Senha
    passwordToggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        if (isPassword) {
            passwordInput.setAttribute('type', 'text');
            passwordToggleIcon.textContent = 'visibility_off';
        } else {
            passwordInput.setAttribute('type', 'password');
            passwordToggleIcon.textContent = 'visibility';
        }
    });

    // 2. Autenticação (Fetch)
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o refresh da página

        const email = emailInput.value;
        const senha = passwordInput.value;
        
        // Basic validation
        if (!email || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login/restaurante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            // 3. Tratamento da Resposta
            if (response.ok) { // status 200-299
                const data = await response.json();
                
                // Salva no localStorage
                localStorage.setItem('restauranteLogado', JSON.stringify(data));

                // Redireciona para o dashboard
                // A pasta admin não existe, então redirecionarei para uma página existente
                // para evitar um erro 404. Usarei DashBoardRestaurantes.html como placeholder.
                // Troque para 'admin/dashboard.html' quando a estrutura de pastas for criada.
                window.location.href = 'DashBoardRestaurantes.html';

            } else if (response.status === 401 || response.status === 404) {
                 alert('E-mail ou senha inválidos.');
            } else {
                // Handle other errors (e.g., server errors)
                const errorData = await response.json();
                alert(`Ocorreu um erro: ${errorData.message || 'Tente novamente mais tarde.'}`);
            }
        } catch (error) {
            console.error('Erro na requisição de login:', error);
            alert('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
        }
    });
});
