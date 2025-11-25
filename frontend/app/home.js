document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000';
    let allRestaurants = [];
    let filteredRestaurants = [];

    const restaurantGrid = document.querySelector('.grid');
    const addressHeader = document.querySelector('header h2');
    const filterChipsContainer = document.querySelector('.flex.gap-3.px-4');

    // 1. Cabeçalho (User Info) & Auth Check
    const usuarioLogadoString = localStorage.getItem('usuarioLogado');
    if (!usuarioLogadoString) {
        window.location.href = 'LoginDoCliente.html'; // Redirect if not logged in
        return;
    }

    const usuarioLogado = JSON.parse(usuarioLogadoString);
    // The user object from login doesn't contain the full address object.
    // Assuming the full address is needed, a fetch to /clientes/:id would be required.
    // For now, I'll use a placeholder as the full address isn't in localStorage.
    // If usuarioLogado.endereco exists and is an object:
    if (usuarioLogado.endereco && usuarioLogado.endereco.rua) {
         addressHeader.textContent = `Entregar em: ${usuarioLogado.endereco.rua}, ${usuarioLogado.endereco.numero}`;
    } else {
        // Fallback if address is not detailed in localStorage
        addressHeader.textContent = `Entregar para: ${usuarioLogado.nome}`;
    }


    // 2. Listagem de Restaurantes
    fetch(`${API_BASE_URL}/restaurantes`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(restaurants => {
            allRestaurants = restaurants;
            filteredRestaurants = allRestaurants;
            renderRestaurants(filteredRestaurants);
        })
        .catch(error => {
            console.error("Falha ao buscar restaurantes:", error);
            if (restaurantGrid) {
                restaurantGrid.innerHTML = `<p class="text-red-500 p-4">Não foi possível carregar os restaurantes. Tente novamente mais tarde.</p>`;
            }
        });

    function renderRestaurants(restaurants) {
        if (!restaurantGrid) return;
        restaurantGrid.innerHTML = ''; // Limpa o conteúdo

        if (restaurants.length === 0) {
            restaurantGrid.innerHTML = `<p class="p-4 text-stone-600 dark:text-stone-400">Nenhum restaurante encontrado.</p>`;
            return;
        }

        restaurants.forEach(restaurante => {
            const card = createRestaurantCard(restaurante);
            restaurantGrid.innerHTML += card;
        });
        
        // Add click listeners after rendering
        document.querySelectorAll('.restaurant-card-link').forEach(cardLink => {
            cardLink.addEventListener('click', function(event) {
                event.preventDefault();
                window.location.href = this.href;
            });
        });
    }

    function createRestaurantCard(restaurante) {
        // Fallback for missing data
        const imageUrl = restaurante.imagem_url || 'https://via.placeholder.com/400x225';
        const rating = restaurante.nota || 'N/A';
        const deliveryTime = restaurante.tempo_entrega_minutos || '25-35';
        const type = restaurante.tipo_cozinha || 'Variada';

        // O card inteiro é um link clicável
        return `
            <a href="CardapioExemplo.html?id=${restaurante.id}" class="restaurant-card-link p-4 @container hover:bg-stone-200/40 dark:hover:bg-stone-800/40 rounded-xl transition-colors block">
                <div class="flex flex-col items-stretch justify-start">
                    <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl" style='background-image: url("${imageUrl}");'></div>
                    <div class="flex w-full min-w-0 grow flex-col items-stretch justify-center gap-1 py-4">
                        <p class="text-[#181311] dark:text-stone-100 text-lg font-bold leading-tight tracking-[-0.015em]">${restaurante.nome}</p>
                        <div class="flex items-center gap-1">
                            <p class="text-sm font-medium leading-normal text-amber-500">★ ${rating}</p>
                            <p class="text-stone-500 dark:text-stone-400 text-sm font-normal leading-normal"> • ${type} • ${deliveryTime} min</p>
                        </div>
                    </div>
                </div>
            </a>
        `;
    }

    // 3. Filtros
    if (filterChipsContainer) {
        filterChipsContainer.addEventListener('click', (event) => {
            const clickedChip = event.target.closest('div[class*="cursor-pointer"]');
            if (!clickedChip) return;

            // Update active chip style
            filterChipsContainer.querySelectorAll('div[class*="cursor-pointer"]').forEach(chip => {
                chip.classList.remove('bg-primary', 'text-white');
                chip.classList.add('bg-stone-200/80', 'dark:bg-stone-700/60', 'hover:bg-stone-300', 'dark:hover:bg-stone-600');
                chip.querySelector('p').classList.remove('text-white');
                chip.querySelector('p').classList.add('text-[#181311]', 'dark:text-stone-200');
            });
            
            clickedChip.classList.add('bg-primary', 'text-white');
            clickedChip.classList.remove('bg-stone-200/80', 'dark:bg-stone-700/60', 'hover:bg-stone-300', 'dark:hover:bg-stone-600');
            clickedChip.querySelector('p').classList.add('text-white');
            clickedChip.querySelector('p').classList.remove('text-[#181311]', 'dark:text-stone-200');

            const filterText = clickedChip.querySelector('p').textContent.toLowerCase();
            
            // Assuming the first chip is "Lanche" or a similar default that should show all.
            // A better approach would be an "Todos" chip. For now, let's treat the first one as a reset.
            if (filterText === 'lanche' && clickedChip === filterChipsContainer.firstElementChild) {
                 filteredRestaurants = allRestaurants;
            } else {
                filteredRestaurants = allRestaurants.filter(r => 
                    r.tipo_cozinha && r.tipo_cozinha.toLowerCase().includes(filterText)
                );
            }
            renderRestaurants(filteredRestaurants);
        });
    }
});
