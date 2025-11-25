// --- auth-guard.js ---
// Este script deve ser o primeiro a ser executado em páginas protegidas.

(function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const restauranteLogado = localStorage.getItem('restauranteLogado');
    const path = window.location.pathname;

    // Constrói o caminho de redirecionamento base de forma mais robusta
    // Considera que o script está em /js/ e as páginas protegidas em /cliente/ ou /admin/
    const basePath = path.includes('/cliente/') || path.includes('/admin/') ? '../' : '';

    // Proteção para as rotas de Cliente
    if (path.includes('/cliente/') && !usuarioLogado) {
        console.log('Acesso negado. Usuário não logado. Redirecionando para o login de cliente...');
        window.location.href = `${basePath}TeladeLogin.html`;
    }

    // Proteção para as rotas de Restaurante (Admin)
    if (path.includes('/admin/') && !restauranteLogado) {
        console.log('Acesso negado. Restaurante não logado. Redirecionando para o login de restaurante...');
        window.location.href = `${basePath}LoginRestaurante.html`;
    }
})();

/**
 * Função global para realizar o logout do sistema.
 * Limpa o localStorage e redireciona para a tela de login apropriada.
 */
function fazerLogout() {
    const path = window.location.pathname;
    const basePath = path.includes('/cliente/') || path.includes('/admin/') ? '../' : '';
    
    const isCliente = !!localStorage.getItem('usuarioLogado');
    
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('restauranteLogado');
    // Limpa também o carrinho, se existir
    localStorage.removeItem('carrinho');

    console.log('Logout realizado com sucesso.');

    if (isCliente) {
        window.location.href = `${basePath}TeladeLogin.html`;
    } else {
        window.location.href = `${basePath}LoginRestaurante.html`;
    }
}
