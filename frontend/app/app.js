// App state
const API_URL = 'http://localhost:8080';
let currentUser = null;
let currentToken = null;
let cart = [];
let restaurants = [];
let currentRestaurant = null;
let currentRestaurantItems = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  updateUI();
  loadRestaurants();
});

// LocalStorage helpers
function loadFromLocalStorage() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const cartData = localStorage.getItem('cart');
  
  if (token && user) {
    currentToken = token;
    currentUser = JSON.parse(user);
  }
  
  if (cartData) {
    cart = JSON.parse(cartData);
  }
}

function saveToLocalStorage() {
  if (currentToken) {
    localStorage.setItem('token', currentToken);
  }
  if (currentUser) {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}

// API Fetch wrapper
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(currentToken && { 'Authorization': `Bearer ${currentToken}` })
    }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao conectar com servidor');
  }
  
  return data;
}

// Navigation
function navigate(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  
  // Show selected page
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.style.display = 'block';
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Load page-specific content
  if (page === 'home') {
    loadRestaurants();
  } else if (page === 'cart') {
    renderCart();
  } else if (page === 'profile') {
    loadProfile();
  }
}

// Auth
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  
  try {
    const response = await apiCall('/auth/login', 'POST', { email, senha });
    
    if (response.success) {
      currentToken = response.data.token;
      currentUser = {
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email
      };
      saveToLocalStorage();
      updateUI();
      navigate('home');
    }
  } catch (err) {
    document.getElementById('login-error').textContent = err.message;
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const nome = document.getElementById('register-nome').value;
  const email = document.getElementById('register-email').value;
  const telefone = document.getElementById('register-telefone').value;
  const senha = document.getElementById('register-senha').value;
  
  try {
    const response = await apiCall('/auth/register', 'POST', { nome, email, telefone, senha });
    
    if (response.success) {
      currentToken = response.data.token;
      currentUser = {
        id: response.data.id,
        nome: response.data.nome,
        email: response.data.email
      };
      saveToLocalStorage();
      updateUI();
      navigate('home');
    }
  } catch (err) {
    document.getElementById('register-error').textContent = err.message;
  }
}

function logout() {
  currentUser = null;
  currentToken = null;
  cart = [];
  localStorage.clear();
  updateUI();
  navigate('home');
}

// UI Updates
function updateUI() {
  const authNav = document.getElementById('auth-nav');
  const userNav = document.getElementById('user-nav');
  
  if (currentUser) {
    authNav.style.display = 'none';
    userNav.style.display = 'flex';
    document.getElementById('user-name').textContent = `Olá, ${currentUser.nome}`;
  } else {
    authNav.style.display = 'flex';
    userNav.style.display = 'none';
  }
  
  updateCartCount();
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

// Restaurants
async function loadRestaurants() {
  try {
    const response = await apiCall('/restaurante');
    if (response.success) {
      restaurants = response.data || [];
      renderRestaurants();
    }
  } catch (err) {
    console.error('Erro ao carregar restaurantes:', err);
    document.getElementById('restaurants-list').innerHTML = '<p>Erro ao carregar restaurantes</p>';
  }
}

function renderRestaurants() {
  const container = document.getElementById('restaurants-list');
  container.innerHTML = '';
  
  restaurants.forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${r.nome}</h3>
      <p>${r.endereco || 'Endereço não disponível'}</p>
      <p>Preço médio: <strong>${r.preco || '-'}</strong></p>
      <button onclick="viewRestaurant(${r.id})">Ver Cardápio</button>
    `;
    container.appendChild(card);
  });
}

// Restaurant Detail
async function viewRestaurant(id) {
  try {
    const restRes = await apiCall(`/restaurante/${id}`);
    if (restRes.success) {
      currentRestaurant = restRes.data;
    }
    
    const itemsRes = await apiCall('/item');
    if (itemsRes.success) {
      currentRestaurantItems = (itemsRes.data || []).filter(item => {
        const itemRestId = item.idRestaurante || item.id_restaurante;
        return String(itemRestId) === String(id);
      });
    }
    
    renderRestaurantDetail();
    navigate('restaurant-detail');
  } catch (err) {
    alert('Erro ao carregar restaurante: ' + err.message);
  }
}

function renderRestaurantDetail() {
  const info = document.getElementById('restaurant-info');
  info.innerHTML = `
    <h2>${currentRestaurant.nome}</h2>
    <p>${currentRestaurant.descricao || 'Sem descrição'}</p>
    <p><strong>Endereço:</strong> ${currentRestaurant.endereco || '-'}</p>
  `;
  
  const itemsList = document.getElementById('items-list');
  itemsList.innerHTML = '';
  
  currentRestaurantItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h4>${item.nome}</h4>
      <p>${item.descricao || '-'}</p>
      <p><strong>R$ ${parseFloat(item.preco || 0).toFixed(2)}</strong></p>
      <button onclick="addToCart(${item.id}, '${item.nome}', ${item.preco || 0})">Adicionar ao Carrinho</button>
    `;
    itemsList.appendChild(card);
  });
}

// Cart
function addToCart(id, nome, preco) {
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, nome, preco, qty: 1, idRestaurante: currentRestaurant?.id });
  }
  
  saveToLocalStorage();
  updateCartCount();
  alert(`${nome} adicionado ao carrinho!`);
}

function renderCart() {
  const container = document.getElementById('cart-items-list');
  
  if (cart.length === 0) {
    container.innerHTML = '<p>Carrinho vazio</p>';
    document.getElementById('checkout-btn').disabled = true;
    return;
  }
  
  container.innerHTML = '';
  let total = 0;
  
  cart.forEach((item, idx) => {
    const itemTotal = item.preco * item.qty;
    total += itemTotal;
    
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <strong>${item.nome}</strong><br>
        R$ ${parseFloat(item.preco).toFixed(2)} x ${item.qty} = R$ ${parseFloat(itemTotal).toFixed(2)}
      </div>
      <div>
        <button onclick="removeFromCart(${idx})">Remover</button>
      </div>
    `;
    container.appendChild(row);
  });
  
  document.getElementById('cart-total').textContent = total.toFixed(2);
  document.getElementById('checkout-btn').disabled = !currentUser;
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  saveToLocalStorage();
  renderCart();
}

// Checkout
async function checkout() {
  if (!currentUser) {
    alert('Faça login para finalizar o pedido');
    navigate('login');
    return;
  }
  
  if (cart.length === 0) {
    alert('Carrinho vazio');
    return;
  }
  
  try {
    const payload = {
      idCliente: currentUser.id,
      idRestaurante: cart[0].idRestaurante,
      idPagamento: null,
      itens: cart.map(item => ({
        idItem: item.id,
        quantidade: item.qty
      }))
    };
    
    const response = await apiCall('/pedido', 'POST', payload);
    
    if (response.success) {
      alert('Pedido criado com sucesso!');
      cart = [];
      saveToLocalStorage();
      updateCartCount();
      navigate('profile');
    }
  } catch (err) {
    alert('Erro ao criar pedido: ' + err.message);
  }
}

// Profile
async function loadProfile() {
  if (!currentUser) {
    navigate('login');
    return;
  }
  
  try {
    const profileDiv = document.getElementById('profile-info');
    profileDiv.innerHTML = `
      <p><strong>Nome:</strong> ${currentUser.nome}</p>
      <p><strong>Email:</strong> ${currentUser.email}</p>
    `;
    
    const response = await apiCall(`/pedido/usuario/${currentUser.id}`);
    
    const ordersList = document.getElementById('orders-list');
    
    if (!response.success || !response.data || response.data.length === 0) {
      ordersList.innerHTML = '<p>Nenhum pedido encontrado</p>';
      return;
    }
    
    ordersList.innerHTML = '';
    
    response.data.forEach(pedido => {
      const orderDiv = document.createElement('div');
      orderDiv.className = 'order-card';
      
      const status = pedido.status || pedido.situacao || 'Pendente';
      const date = pedido.createdAt || pedido.data || pedido.dataCriacao || '-';
      
      orderDiv.innerHTML = `
        <h4>Pedido #${pedido.id}</h4>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Data:</strong> ${date}</p>
        <p><strong>Restaurante:</strong> ${pedido.idRestaurante || pedido.id_restaurante || '-'}</p>
      `;
      
      ordersList.appendChild(orderDiv);
    });
  } catch (err) {
    document.getElementById('orders-list').innerHTML = '<p>Erro ao carregar pedidos</p>';
    console.error(err);
  }
}
