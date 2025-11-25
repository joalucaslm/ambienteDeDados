document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (!usuarioLogado) {
        window.location.href = 'LoginDoCliente.html';
        return;
    }

    const mainContainer = document.querySelector('main');
    // The first two children are the title and the filters, we keep them.
    const initialCards = Array.from(mainContainer.children).slice(2);
    initialCards.forEach(card => card.remove());

    const emptyStateHTML = `
        <div class="p-4">
            <div class="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-white/50 dark:bg-background-dark/30 p-8 text-center">
                <span class="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500">receipt_long</span>
                <p class="text-[#181311] dark:text-white text-lg font-bold">Sem pedidos por aqui</p>
                <p class="text-[#8a6b60] dark:text-gray-400 text-sm max-w-xs">Não há pedidos para exibir nesta categoria no momento.</p>
                <a href="HomeCliente.html" class="mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-primary text-white text-sm font-medium leading-normal">
                    <span class="truncate">Ver Restaurantes</span>
                </a>
            </div>
        </div>`;

    let allPedidos = [];

    const statusConfig = {
        'Pendente': { width: '25%', color: 'bg-gray-400' },
        'Em preparação': { width: '50%', color: 'bg-yellow-500' },
        'Saiu para entrega': { width: '75%', color: 'bg-primary' },
        'Concluido': { width: '100%', color: 'bg-green-500' },
        'Cancelado': { width: '100%', color: 'bg-danger' },
    };

    const formatCurrency = (value) => {
        return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const renderPedidos = (pedidos) => {
        // Clear only order cards and empty state
        const currentCards = mainContainer.querySelectorAll('.p-4');
        currentCards.forEach(card => card.remove());

        if (pedidos.length === 0) {
            mainContainer.insertAdjacentHTML('beforeend', emptyStateHTML);
            return;
        }

        pedidos.forEach(pedido => {
            const config = statusConfig[pedido.status] || { width: '0%', color: 'bg-gray-400' };
            const cardHTML = `
                <div class="p-4 @container">
                    <div class="flex flex-col items-stretch justify-start rounded-xl shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-background-dark/50">
                        <div class="flex flex-col items-stretch justify-center gap-2 p-4">
                            <div class="flex items-center gap-3">
                                <img class="size-12 rounded-lg object-cover" src="${pedido.restaurante_imagem_capa || 'https://via.placeholder.com/150'}" alt="Logo do restaurante ${pedido.restaurante_nome}">
                                <div class="flex flex-col">
                                    <p class="text-[#181311] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">${pedido.restaurante_nome}</p>
                                    <p class="text-[#8a6b60] dark:text-gray-400 text-sm font-normal leading-normal">Pedido #${pedido.id}</p>
                                </div>
                            </div>
                            <div class="flex flex-col gap-3 py-4">
                                <div class="flex gap-6 justify-between items-center">
                                    <p class="text-[#181311] dark:text-white text-base font-medium leading-normal">${pedido.status}</p>
                                    <p class="text-[#8a6b60] dark:text-gray-400 text-sm font-normal leading-normal">${formatTime(pedido.data_pedido)}</p>
                                </div>
                                <div class="rounded-full bg-[#e6dedb] dark:bg-white/10 h-2">
                                    <div class="h-2 rounded-full ${config.color}" style="width: ${config.width};"></div>
                                </div>
                            </div>
                            <div class="flex items-end gap-3 justify-between">
                                <p class="text-[#181311] dark:text-white text-base font-normal leading-normal">Total: ${formatCurrency(pedido.valor_total)}</p>
                                <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-medium leading-normal">
                                    <span class="truncate">Ver Detalhes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            mainContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    };

    const filterAndRender = () => {
        const filterValue = document.querySelector('input[name="order_status_filter"]:checked').value;
        let filteredPedidos = [];

        if (filterValue === 'Ativos') {
            const activeStatus = ['Pendente', 'Em preparação', 'Saiu para entrega'];
            filteredPedidos = allPedidos.filter(p => activeStatus.includes(p.status));
        } else { // Anteriores
            const inactiveStatus = ['Concluido', 'Cancelado'];
            filteredPedidos = allPedidos.filter(p => inactiveStatus.includes(p.status));
        }
        renderPedidos(filteredPedidos);
    };

    fetch(`http://localhost:3000/api/pedidos?idCliente=${usuarioLogado.id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar pedidos');
            }
            return response.json();
        })
        .then(data => {
            allPedidos = data;
            filterAndRender(); // Renderiza a lista inicial (Ativos)
        })
        .catch(error => {
            console.error('Erro:', error);
            mainContainer.insertAdjacentHTML('beforeend', emptyStateHTML);
        });

    document.querySelectorAll('input[name="order_status_filter"]').forEach(radio => {
        radio.addEventListener('change', filterAndRender);
    });
});
