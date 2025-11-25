document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const restauranteId = params.get('id');

    if (!restauranteId) {
        window.location.href = '/frontend/app/index.html';
        return;
    }

    const API_BASE_URL = 'http://localhost:3000';
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const categoryMap = {
        'Entrada': 'entradas',
        'Prato Principal': 'pratos-principais',
        'Pizza': 'pizzas',
        'Bebida': 'bebidas',
        'Sobremesa': 'sobremesas'
    };

    // Fetch restaurant details
    fetch(`${API_BASE_URL}/restaurantes/${restauranteId}`)
        .then(response => response.json())
        .then(restaurante => {
            document.title = `${restaurante.nome} - Menu`;
            
            const headerImageDiv = document.querySelector('.bg-cover.bg-center');
            headerImageDiv.style.backgroundImage = `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 40%), url("${restaurante.imagem_url || 'https://via.placeholder.com/1200x300'}")`;
            
            const restauranteNameH1 = document.querySelector('h1');
            restauranteNameH1.textContent = restaurante.nome;

            // This is a placeholder, as the API doesn't provide all this info yet.
            const metaText = document.querySelector('p.text-stone-600');
            // Assuming we can get tipo_cozinha, maybe rating and delivery time in the future
            // For now, we'll just display what we have.
            metaText.textContent = `${restaurante.tipo_cozinha || 'Cozinha'} • ⭐ 4.8 • 30-45 min delivery`;
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do restaurante:', error);
            // Optionally, redirect or show an error message
        });

    // Fetch and render menu items
    fetch(`${API_BASE_URL}/restaurantes/${restauranteId}/itens`)
        .then(response => response.json())
        .then(items => {
            // Clear mock items
            Object.values(categoryMap).forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const container = section.querySelector('.flex.flex-col.gap-4');
                    if(container) container.innerHTML = '';
                }
            });

            items.forEach(item => {
                const sectionId = categoryMap[item.categoria];
                if (!sectionId) {
                    console.warn(`Categoria não mapeada: ${item.categoria}`);
                    return;
                }

                const section = document.getElementById(sectionId);
                if (section) {
                    const container = section.querySelector('.flex.flex-col.gap-4');
                    const itemHtml = createItemCard(item);
                    container.innerHTML += itemHtml;
                }
            });

            // Add event listeners to the new buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const itemId = event.currentTarget.dataset.itemId;
                    const item = items.find(i => i.id == itemId);
                    if (item) {
                        addToCart(item);
                    }
                });
            });
        })
        .catch(error => console.error('Erro ao buscar itens do cardápio:', error));

    function createItemCard(item) {
        return `
            <div class="p-4 bg-white dark:bg-stone-900/50 rounded-xl">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex flex-[2_2_0px] flex-col gap-2">
                        <div class="flex flex-col gap-1">
                            <p class="text-stone-900 dark:text-stone-100 text-base font-bold leading-tight">${item.nome}</p>
                            <p class="text-stone-600 dark:text-stone-400 text-sm font-normal leading-normal">${item.descricao}</p>
                        </div>
                        <p class="text-stone-800 dark:text-stone-200 text-sm font-medium">R$ ${Number(item.preco).toFixed(2).replace('.', ',')}</p>
                        <button class="add-to-cart-btn flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-3 mt-2 bg-primary/20 dark:bg-primary/30 text-primary gap-1 text-sm font-medium leading-normal w-fit" data-item-id="${item.id}">
                            <span class="truncate">Adicionar</span>
                            <span class="material-symbols-outlined text-base">add</span>
                        </button>
                    </div>
                    <div class="w-24 h-24 sm:w-28 sm:h-28 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-shrink-0" style='background-image: url("${item.imagem_url || 'https://via.placeholder.com/112x112'}");'></div>
                </div>
            </div>
        `;
    }

    function addToCart(item) {
        carrinho.push(item);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        alert(`${item.nome} foi adicionado ao carrinho!`);
        updateFooter();
    }

    function updateFooter() {
        const total = carrinho.reduce((acc, item) => acc + Number(item.preco), 0);
        const itemCount = carrinho.length;

        const totalSpan = document.querySelector('footer span:nth-child(1)');
        const countSpan = document.querySelector('footer .flex.items-center.justify-center.w-6.h-6 span');
        
        if (totalSpan) {
            totalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }
        if (countSpan) {
            countSpan.textContent = itemCount;
        }
        
        const viewCartButton = document.querySelector('footer button');
        if (itemCount === 0) {
            viewCartButton.style.display = 'none';
        } else {
            viewCartButton.style.display = 'flex';
        }
    }
    
    // Initial footer update on page load
    updateFooter();

    // Make footer "Ver carrinho" button functional
    const viewCartButton = document.querySelector('footer button');
    if(viewCartButton) {
        viewCartButton.addEventListener('click', () => {
            // Assuming you have a Carrinho.html page
            window.location.href = 'Carrinho.html';
        });
    }
});
