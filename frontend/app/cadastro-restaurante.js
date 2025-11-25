document.addEventListener('DOMContentLoaded', () => {
    // Seletores
    const form = document.querySelector('form');
    const nomeInput = document.querySelector('input[placeholder*="Digite o nome do seu restaurante"]');
    const emailInput = document.querySelector('input[placeholder="seuemail@exemplo.com"]');
    const senhaInput = document.querySelector('input[placeholder="Crie uma senha forte"]');
    const confirmarSenhaInput = document.querySelector('input[placeholder="Repita a senha"]');
    const enderecoInput = document.querySelector('input[placeholder*="Rua das Flores"]');
    const tipoCozinhaSelect = document.querySelector('select');
    
    // Botões de toggle
    const toggleSenhaButton = senhaInput.nextElementSibling;
    const toggleConfirmarSenhaButton = confirmarSenhaInput.nextElementSibling;

    // Função para alternar visibilidade da senha
    const togglePasswordVisibility = (input, button) => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        const icon = button.querySelector('.material-symbols-outlined');
        icon.textContent = type === 'password' ? 'visibility' : 'visibility_off';
    };

    // Eventos para os botões de toggle
    if (toggleSenhaButton) {
        toggleSenhaButton.addEventListener('click', (e) => {
            e.preventDefault();
            togglePasswordVisibility(senhaInput, toggleSenhaButton);
        });
    }
    if (toggleConfirmarSenhaButton) {
        toggleConfirmarSenhaButton.addEventListener('click', (e) => {
            e.preventDefault();
            togglePasswordVisibility(confirmarSenhaInput, toggleConfirmarSenhaButton);
        });
    }

    // Envio do Formulário
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Validação de Senha
            if (senhaInput.value !== confirmarSenhaInput.value) {
                alert("As senhas não conferem.");
                return;
            }

            // Captura de valores
            const payload = {
                nome: nomeInput.value,
                email: emailInput.value,
                senha: senhaInput.value,
                endereco: enderecoInput.value,
                tipoCozinha: tipoCozinhaSelect.value
            };
            
            // Verifica se uma opção válida de cozinha foi selecionada
            if (tipoCozinhaSelect.value === "Selecione uma opção") {
                alert("Por favor, selecione um tipo de cozinha.");
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/restaurantes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    alert(`Bem-vindo, ${payload.nome}! Seu restaurante foi cadastrado com sucesso.`);
                    window.location.href = 'login.html';
                } else {
                    const errorData = await response.json();
                    alert(`Erro no cadastro: ${errorData.message || 'Verifique os dados e tente novamente.'}`);
                }
            } catch (error) {
                console.error('Erro na requisição de cadastro:', error);
                alert('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
            }
        });
    }
});
