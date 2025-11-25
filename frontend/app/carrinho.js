document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000';
    const DELIVERY_FEE = 5.00;

    const cartItemsContainer = document.querySelector('.divide-y');
    const subtotalEl = document.querySelector('.flex.justify-between.text-sm span.font-medium');
    const deliveryFeeEl = document.querySelectorAll('.flex.justify-between.text-sm span.font-medium')[1];
    const totalEl = document.querySelector('.flex.justify-between.text-base.font-bold span:last-child');
    const checkoutButtons = document.querySelectorAll('button.bg-primary.text-white');

    let cart = JSON.parse(localStorage.getItem('carrinho')) || [];
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function updateLocalStorage(newCart) {
        cart = newCart;
        localStorage.setItem('carrinho', JSON.stringify(cart));
        render();
    }

    function handleIncreaseQuantity(itemId) {
        const itemToAdd = cart.find(item => item.id == itemId);
        if (itemToAdd) {
            const newCart = [...cart, itemToAdd];
            updateLocalStorage(newCart);
        }
    }

    function handleDecreaseQuantity(itemId) {
        const itemIndex = cart.findIndex(item => item.id == itemId);
        if (itemIndex > -1) {
            const newCart = [...cart];
            newCart.splice(itemIndex, 1);
            updateLocalStorage(newCart);
        }
    }
    
    function handleRemoveItem(itemId) {
        const newCart = cart.filter(item => item.id != itemId);
        updateLocalStorage(newCart);
    }
    
    function calculateTotals(groupedCart) {
        const subtotal = groupedCart.reduce((acc, item) => acc + (item.preco * item.quantity), 0);
        const total = subtotal + DELIVERY_FEE;

        subtotalEl.textContent = formatCurrency(subtotal);
        deliveryFeeEl.textContent = formatCurrency(DELIVERY_FEE);
        totalEl.textContent = formatCurrency(total);
        
        return { subtotal, total };
    }

    function render() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="p-4 text-center text-gray-500">Seu carrinho está vazio.</p>';
            calculateTotals([]);
            return;
        }

        const groupedCart = cart.reduce((acc, item) => {
            const existingItem = acc.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                acc.push({ ...item, quantity: 1 });
            }
            return acc;
        }, []);

        cartItemsContainer.innerHTML = '';
        groupedCart.forEach(item => {
            const itemHtml = `
                <div class="flex gap-4 bg-transparent px-4 py-3 justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px]" style='background-image: url("${item.imagem_url || ''}");'></div>
                        <div class="flex flex-1 flex-col justify-center">
                            <p class="text-[#181311] dark:text-white text-base font-medium leading-normal">${item.nome}</p>
                            <p class="text-[#8a6b60] dark:text-gray-400 text-sm font-normal leading-normal">${formatCurrency(Number(item.preco))}</p>
                        </div>
                    </div>
                    <div class="shrink-0 flex items-center gap-3">
                        <div class="flex items-center gap-2 text-[#181311] dark:text-white">
                            <button data-item-id="${item.id}" class="btn-decrease text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f1f0] dark:bg-gray-700 cursor-pointer">-</button>
                            <span class="text-base font-medium leading-normal w-4 text-center">${item.quantity}</span>
                            <button data-item-id="${item.id}" class="btn-increase text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-[#f5f1f0] dark:bg-gray-700 cursor-pointer">+</button>
                        </div>
                        <button data-item-id="${item.id}" class="btn-remove text-red-500">
                            <span class="material-symbols-outlined text-xl">delete</span>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHtml;
        });

        calculateTotals(groupedCart);
        addEventListeners();
    }
    
    function addEventListeners() {
        document.querySelectorAll('.btn-increase').forEach(button => {
            button.onclick = (e) => handleIncreaseQuantity(e.currentTarget.dataset.itemId);
        });
        document.querySelectorAll('.btn-decrease').forEach(button => {
            button.onclick = (e) => handleDecreaseQuantity(e.currentTarget.dataset.itemId);
        });
        document.querySelectorAll('.btn-remove').forEach(button => {
            // The icon might capture the click, so listen on the button
            button.onclick = (e) => handleRemoveItem(e.currentTarget.dataset.itemId);
        });
    }

    async function handleCheckout() {
        if (!usuarioLogado || !usuarioLogado.cliente || !usuarioLogado.cliente.id) {
            alert('Você precisa estar logado para finalizar o pedido.');
            window.location.href = 'LoginDoCliente.html';
            return;
        }

        if (cart.length === 0) {
            alert('Seu carrinho está vazio.');
            return;
        }
        
        const groupedCart = cart.reduce((acc, item) => {
            const existingItem = acc.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                acc.push({ ...item, quantity: 1 });
            }
            return acc;
        }, []);

        const { total } = calculateTotals(groupedCart);
        const paymentMethodInput = document.querySelector('input[name="payment-method"]:checked');
        // Simple mapping from radio's parent text content to required value
        const paymentMethod = paymentMethodInput.parentElement.querySelector('p').textContent.includes('Cartão') ? 'Cartao' : 'Dinheiro';


        const payload = {
            idCliente: usuarioLogado.cliente.id,
            idRestaurante: cart[0].id_restaurante,
            itens: groupedCart.map(item => ({
                idItem: item.id,
                quantidade: item.quantity,
                precoUnitario: Number(item.preco)
            })),
            metodoPagamento: paymentMethod,
            valorTotal: total
        };

        try {
            const response = await fetch(`${API_BASE_URL}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Assuming your login endpoint provides a token that needs to be sent
                    'Authorization': `Bearer ${usuarioLogado.token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('Pedido finalizado com sucesso!');
                localStorage.removeItem('carrinho');
                window.location.href = 'MeuPedidosCliente.html'; // Redirect to orders page
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ${response.status}`);
            }
        } catch (error) {
            console.error('Falha ao finalizar o pedido:', error);
            alert(`Ocorreu um erro ao finalizar o pedido: ${error.message}`);
        }
    }

    checkoutButtons.forEach(button => button.addEventListener('click', handleCheckout));
    
    // Initial render
    render();
});
