document.addEventListener('DOMContentLoaded', () => {
    // Seletores
    const emailInput = document.querySelector('input[placeholder*="e-mail"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Entrar');
    const togglePasswordButton = document.querySelector('button[aria-label="Mostrar senha"]');

    // Funcionalidade de Toggle Senha
    if (togglePasswordButton && passwordInput) {
        togglePasswordButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Alterna o ícone
            const icon = togglePasswordButton.querySelector('.material-symbols-outlined');
            icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    }

    // Função de Autenticação
    const handleLogin = async () => {
        const email = emailInput.value;
        const senha = passwordInput.value;

        if (!email || !senha) {
            alert('Por favor, preencha o e-mail e a senha.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (!response.ok) {
                // Tenta pegar uma mensagem de erro do corpo da resposta
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || `Erro ${response.status}: ${response.statusText}`;
                alert(`Falha no login: ${errorMessage}`);
                return;
            }

            const data = await response.json();
            
            if (data.usuario) {
                localStorage.setItem('usuarioLogado', JSON.stringify(data.usuario));

                if (data.usuario.tipo === 'cliente') {
                    window.location.href = 'cliente/home.html';
                } else if (data.usuario.tipo === 'restaurante') {
                    window.location.href = 'admin/dashboard.html';
                } else {
                    alert('Tipo de usuário desconhecido.');
                }
            } else {
                alert('Resposta do servidor não contém informações do usuário.');
            }

        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            alert('Ocorreu um erro de rede. Verifique sua conexão e se o servidor está online.');
        }
    };

    // Eventos
    if(loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }

    if(emailInput && passwordInput) {
        const handleKeyUp = (event) => {
            if (event.key === 'Enter') {
                handleLogin();
            }
        };
        emailInput.addEventListener('keyup', handleKeyUp);
        passwordInput.addEventListener('keyup', handleKeyUp);
    }
});
