document.addEventListener('DOMContentLoaded', () => {
    // Seletores
    const form = document.querySelector('form');
    const nomeInput = document.querySelector('input[placeholder*="nome"]');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const celularInput = document.querySelector('input[type="tel"]');
    // O botão de toggle é o próximo elemento button após o input de senha
    const togglePasswordButton = passwordInput.nextElementSibling;

    // Funcionalidade de Toggle Senha
    if (togglePasswordButton && passwordInput) {
        togglePasswordButton.addEventListener('click', (e) => {
            // Impede que o clique no botão envie o formulário
            e.preventDefault(); 
            
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Alterna o ícone
            const icon = togglePasswordButton.querySelector('.material-symbols-outlined');
            icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
        });
    }

    // Envio do Formulário
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Previne o comportamento padrão

            // Captura os valores
            const nome = nomeInput.value;
            const email = emailInput.value;
            const senha = passwordInput.value;
            const telefone = celularInput.value;

            // Validação simples
            if (!nome || !email || !senha || !telefone) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Monta o payload
            const payload = {
                nome,
                email,
                senha,
                telefone,
                perfil: 'cliente'
            };

            try {
                const response = await fetch('http://localhost:3000/clientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.status === 201) {
                    alert('Conta criada com sucesso!');
                    // Redireciona para a página de login
                    window.location.href = 'login.html'; 
                } else {
                    const errorData = await response.json();
                    alert(`Erro ao criar conta: ${errorData.message || 'Tente novamente.'}`);
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            }
        });
    }
});
