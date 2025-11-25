document.addEventListener("DOMContentLoaded", () => {
  // 1. AUTENTICAÇÃO
  const restauranteLogado = JSON.parse(localStorage.getItem("restauranteLogado"));
  if (!restauranteLogado) {
    window.location.href = "login-restaurante.html";
    return;
  }
  const idRestaurante = restauranteLogado.id;

  // 2. GERENCIAMENTO DE ESTADO (TABS)
  let statusAtual = "Pendente";
  let todosOsPedidos = []; // Cache para todos os pedidos
  const tabs = document.querySelectorAll(".flex.border-b a");
  const cardsContainer = document.querySelector(".space-y-4");

  const atualizarAbas = () => {
    tabs.forEach((tab, index) => {
      const statusTab = ["Pendente", "Em Preparação", "Saiu para Entrega"][index];
      if (statusTab === statusAtual) {
        tab.classList.remove("border-b-transparent", "text-[#8a6b60]", "dark:text-gray-400");
        tab.classList.add("border-b-primary", "text-primary");
      } else {
        tab.classList.remove("border-b-primary", "text-primary");
        tab.classList.add("border-b-transparent", "text-[#8a6b60]", "dark:text-gray-400");
      }
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      statusAtual = ["Pendente", "Em Preparação", "Saiu para Entrega"][index];
      atualizarAbas();
      renderizarPedidos();
    });
  });

  // 3. BUSCA DE DADOS (POLLING)
  const carregarPedidos = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/restaurante/${idRestaurante}/pedidos`);
      if (!response.ok) {
        throw new Error("Erro ao buscar pedidos");
      }
      todosOsPedidos = await response.json();
      renderizarPedidos();
    } catch (error) {
      console.error(error);
    }
  };

  // 4. RENDERIZAÇÃO DOS CARDS
  const renderizarPedidos = () => {
    cardsContainer.innerHTML = ""; // Limpa a lista

    const pedidosFiltrados = todosOsPedidos.filter(
      (pedido) => pedido.status === statusAtual
    );

    // Atualiza contadores nas abas
    const contadores = {
      Pendente: 0,
      "Em Preparação": 0,
      "Saiu para Entrega": 0,
    };
    todosOsPedidos.forEach(p => {
        if(contadores[p.status] !== undefined) {
            contadores[p.status]++;
        }
    });
    
    tabs[0].querySelector('p').textContent = `Novos Pedidos (${contadores.Pendente})`;
    tabs[1].querySelector('p').textContent = `Em Preparação (${contadores['Em Preparação']})`;
    tabs[2].querySelector('p').textContent = `Saiu para Entrega (${contadores['Saiu para Entrega']})`;


    if (pedidosFiltrados.length === 0) {
      cardsContainer.innerHTML = `<p class="text-center text-gray-500">Nenhum pedido nesta categoria.</p>`;
      return;
    }

    pedidosFiltrados.forEach((pedido) => {
      const card = document.createElement("div");
      card.className = "@container";

      let textoBotao, novoStatus;
      if (pedido.status === "Pendente") {
        textoBotao = "Aceitar Pedido";
        novoStatus = "Em Preparação";
      } else if (pedido.status === "Em Preparação") {
        textoBotao = "Despachar";
        novoStatus = "Saiu para Entrega";
      } else if (pedido.status === "Saiu para Entrega") {
        textoBotao = "Concluir";
        novoStatus = "Entregue"; // O status final é "Entregue" para sumir da lista
      }
      
      // Construir a lista de itens (simplificado)
      const itensDesc = pedido.itens.map(item => `${item.quantidade}x ${item.nomeItem}`).join(', ');

      card.innerHTML = `
        <div class="flex flex-col items-stretch justify-start rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.1)] bg-white dark:bg-[#181311] dark:border dark:border-[#3a2b27]">
            <div class="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 p-4">
                <p class="text-[#8a6b60] dark:text-gray-400 text-sm font-normal leading-normal">Pedido #${pedido.id}</p>
                <p class="text-[#181311] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">${pedido.nomeCliente}</p>
                <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:items-end sm:justify-between">
                    <div class="flex flex-col gap-1">
                        <p class="text-[#8a6b60] dark:text-gray-400 text-base font-normal leading-normal">${itensDesc}</p>
                        <p class="text-[#8a6b60] dark:text-gray-400 text-base font-normal leading-normal">Observações: ${pedido.observacoes || 'Nenhuma.'}</p>
                    </div>
                    <button data-id-pedido="${pedido.id}" data-novo-status="${novoStatus}" class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal self-start sm:self-end">
                        <span class="truncate">${textoBotao}</span>
                    </button>
                </div>
            </div>
        </div>
      `;
      cardsContainer.appendChild(card);
    });
  };

  // 5. AÇÃO DO BOTÃO
  cardsContainer.addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const idPedido = button.dataset.idPedido;
    const novoStatus = button.dataset.novoStatus;

    if (!idPedido || !novoStatus) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/pedidos/${idPedido}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (response.ok) {
        // Remove o pedido do cache para refletir a mudança de status imediatamente
        const index = todosOsPedidos.findIndex(p => p.id === parseInt(idPedido));
        if (index > -1) {
            if (novoStatus === 'Entregue') {
                todosOsPedidos.splice(index, 1);
            } else {
                todosOsPedidos[index].status = novoStatus;
            }
        }
        renderizarPedidos();
      } else {
        const errorData = await response.json();
        console.error("Erro ao atualizar status:", errorData.message);
        alert(`Erro ao atualizar status: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão ao tentar atualizar o pedido.");
    }
  });

  // CARREGAMENTO INICIAL E POLLING
  carregarPedidos(); // Carga inicial
  setInterval(carregarPedidos, 10000); // Polling a cada 10 segundos
});
