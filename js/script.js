// State Management
let catalog = JSON.parse(JSON.stringify(products)); // Deep copy from data.js
let cart = JSON.parse(localStorage.getItem('aurora_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('aurora_wishlist')) || [];
let currentDiscount = 0; // percentage

// DOM Elements
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

// Cart DOM
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDiscount = document.getElementById('cartDiscount');
const cartTotal = document.getElementById('cartTotal');
const discountRow = document.getElementById('discountRow');
const promoCodeInput = document.getElementById('promoCode');
const applyPromoBtn = document.getElementById('applyPromoBtn');

// Wishlist DOM
const wishlistCount = document.getElementById('wishlistCount');
const wishlistItemsContainer = document.getElementById('wishlistItemsContainer');
const emptyWishlistMessage = document.getElementById('emptyWishlistMessage');

// Quick View DOM
const quickViewModalEl = document.getElementById('quickViewModal');
let quickViewModal;
if(quickViewModalEl) { quickViewModal = new bootstrap.Modal(quickViewModalEl); }

const toastContainer = document.querySelector('.toast-container');

// Initialize Application
function init() {
  resetCatalog();
  reconcileStock();
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  startCountdown();
  setupEventListeners();
}

function resetCatalog() {
  catalog = JSON.parse(JSON.stringify(products));
}

// Reconcile catalog stock with existing cart items from localStorage
function reconcileStock() {
  cart.forEach(cartItem => {
    const product = catalog.find(p => p.id === cartItem.id);
    if (product) {
      product.stock -= cartItem.quantity;
    }
  });
}

// Format Currency
const formatPrice = (price) => `$${price.toFixed(2)}`;

// Render Product Grid
function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const maxPrice = parseInt(priceRange.value);
  const sortBy = sortFilter.value;

  // Filter
  let filtered = catalog.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
    const matchCategory = category === 'all' || p.category === category;
    const matchPrice = p.price <= maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });

  // Sort
  if (sortBy === 'priceLow') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'priceHigh') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  // Render
  productGrid.innerHTML = '';
  
  if (filtered.length === 0) {
    productGrid.innerHTML = `<div class="col-12 text-center text-white-50 py-5">
      <h4>No products found matching your criteria.</h4>
    </div>`;
    return;
  }

  filtered.forEach(p => {
    let stockBadge = '';
    let btnDisabled = '';
    let btnText = 'ADD TO CART';

    if (p.stock <= 0) {
      stockBadge = `<div class="stock-badge out">SOLD OUT</div>`;
      btnDisabled = 'disabled';
      btnText = 'SOLD OUT';
    } else if (p.stock <= 5) {
      stockBadge = `<div class="stock-badge low">ONLY ${p.stock} LEFT</div>`;
    } else {
      stockBadge = `<div class="stock-badge normal">IN STOCK</div>`;
    }

    const isWishlisted = wishlist.includes(p.id);
    const heartClass = isWishlisted ? 'fa-solid active' : 'fa-regular';

    const card = document.createElement('div');
    card.className = 'col-sm-6 col-md-4 col-lg-3';
    card.innerHTML = `
      <div class="product-card">
        <div class="product-image-container" style="cursor: pointer;" onclick="openQuickView(${p.id})">
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${p.id})">
            <i class="${heartClass} fa-heart"></i>
          </button>
          ${stockBadge}
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="card-body-custom d-flex flex-column h-100">
          <div class="product-category">${p.category}</div>
          <h3 class="product-title">${p.name}</h3>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="product-price">${formatPrice(p.price)}</div>
            <div class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating}</div>
          </div>
          <p class="text-white-50 small flex-grow-1">${p.description}</p>
          <button class="btn btn-primary-custom w-100 mt-2" onclick="addToCart(${p.id})" ${btnDisabled}>
            ${btnText}
          </button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Add to Cart
function addToCart(id) {
  const product = catalog.find(p => p.id === id);
  if (!product || product.stock <= 0) return;

  product.stock -= 1;
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
  }

  saveCart();
  renderProducts();
  updateCartUI();
  showToast(`Added ${product.name} to cart.`);
  
  // If quick view modal is open, update its state
  if (document.getElementById('quickViewAddToCartBtn').getAttribute('onclick') === `addToCart(${id})`) {
    updateQuickViewStock(id);
  }
}

// Remove / Decrease from Cart
function removeFromCart(id) {
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  const item = cart[itemIndex];
  const product = catalog.find(p => p.id === id);

  item.quantity -= 1;
  if (product) product.stock += 1; // Restore stock

  if (item.quantity <= 0) {
    cart.splice(itemIndex, 1);
  }

  saveCart();
  renderProducts();
  updateCartUI();
  
  if (document.getElementById('quickViewAddToCartBtn').getAttribute('onclick') === `addToCart(${id})`) {
    updateQuickViewStock(id);
  }
}

function saveCart() {
  localStorage.setItem('aurora_cart', JSON.stringify(cart));
}

// Update Cart UI with Discount
function updateCartUI() {
  let count = 0;
  let subtotal = 0;

  document.querySelectorAll('.cart-item').forEach(el => el.remove());

  if (cart.length === 0) {
    emptyCartMessage.style.display = 'block';
  } else {
    emptyCartMessage.style.display = 'none';
    
    cart.forEach(item => {
      count += item.quantity;
      subtotal += item.price * item.quantity;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img me-3">
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.name}</h6>
          <div class="text-primary">${formatPrice(item.price)}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="cart-qty-btn" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-minus fa-xs"></i></button>
          <span>${item.quantity}</span>
          <button class="cart-qty-btn" onclick="addToCart(${item.id})"><i class="fa-solid fa-plus fa-xs"></i></button>
        </div>
      `;
      cartItemsContainer.insertBefore(itemEl, emptyCartMessage);
    });
  }

  cartCount.textContent = count;
  cartSubtotal.textContent = formatPrice(subtotal);

  if (currentDiscount > 0 && subtotal > 0) {
    const discountAmount = subtotal * (currentDiscount / 100);
    discountRow.style.setProperty('display', 'flex', 'important');
    cartDiscount.textContent = `-${formatPrice(discountAmount)}`;
    cartTotal.textContent = formatPrice(subtotal - discountAmount);
  } else {
    discountRow.style.setProperty('display', 'none', 'important');
    cartTotal.textContent = formatPrice(subtotal);
  }
}

// Promo Code Logic
function applyPromo() {
  const code = promoCodeInput.value.trim().toUpperCase();
  if (code === 'VOID20') {
    currentDiscount = 20;
    showToast('Promo code applied: 20% OFF');
  } else {
    currentDiscount = 0;
    showToast('Invalid promo code.');
  }
  updateCartUI();
}

// Wishlist Logic
function toggleWishlist(id) {
  const index = wishlist.indexOf(id);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('Removed from wishlist');
  } else {
    wishlist.push(id);
    showToast('Added to wishlist');
  }
  localStorage.setItem('aurora_wishlist', JSON.stringify(wishlist));
  renderProducts();
  updateWishlistUI();
}

function updateWishlistUI() {
  wishlistCount.textContent = wishlist.length;
  
  document.querySelectorAll('.wishlist-item').forEach(el => el.remove());

  if (wishlist.length === 0) {
    emptyWishlistMessage.style.display = 'block';
  } else {
    emptyWishlistMessage.style.display = 'none';
    
    wishlist.forEach(id => {
      // Find original product info (not state-dependent catalog stock)
      const p = products.find(p => p.id === id);
      if (!p) return;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item wishlist-item'; // Reuse cart item styling
      itemEl.innerHTML = `
        <img src="${p.image}" alt="${p.name}" class="cart-item-img me-3" style="cursor:pointer" onclick="openQuickView(${p.id})">
        <div class="flex-grow-1">
          <h6 class="mb-1">${p.name}</h6>
          <div class="text-primary">${formatPrice(p.price)}</div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-light" onclick="addToCart(${p.id})"><i class="fa-solid fa-cart-plus"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="toggleWishlist(${p.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      wishlistItemsContainer.insertBefore(itemEl, emptyWishlistMessage);
    });
  }
}

// Quick View Modal Logic
function openQuickView(id) {
  const p = catalog.find(prod => prod.id === id);
  if(!p) return;
  
  document.getElementById('quickViewImage').src = p.image;
  document.getElementById('quickViewCategory').textContent = p.category;
  document.getElementById('quickViewName').textContent = p.name;
  document.getElementById('quickViewPrice').textContent = formatPrice(p.price);
  document.getElementById('quickViewRating').innerHTML = `<i class="fa-solid fa-star text-warning"></i> ${p.rating}`;
  document.getElementById('quickViewDescription').textContent = p.description;
  
  updateQuickViewStock(id);
  quickViewModal.show();
}

function updateQuickViewStock(id) {
  const p = catalog.find(prod => prod.id === id);
  if(!p) return;

  const stockEl = document.getElementById('quickViewStock');
  const btn = document.getElementById('quickViewAddToCartBtn');
  
  if (p.stock <= 0) {
    stockEl.innerHTML = `<span class="text-danger fw-bold"><i class="fa-solid fa-xmark"></i> SOLD OUT</span>`;
    btn.disabled = true;
    btn.textContent = 'SOLD OUT';
  } else {
    stockEl.innerHTML = `<span class="${p.stock <= 5 ? 'text-warning' : 'text-success'} fw-bold">
      <i class="fa-solid fa-check"></i> ${p.stock} in stock
    </span>`;
    btn.disabled = false;
    btn.textContent = 'ADD TO CART';
  }
  btn.setAttribute('onclick', `addToCart(${id})`);
}


// Toast Notification
function showToast(message) {
  const toastId = 'toast' + Date.now();
  const toastHTML = `
    <div id="${toastId}" class="toast toast-custom align-items-center border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <i class="fa-solid fa-check-circle text-primary me-2"></i> ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  
  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });
}

// Countdown Timer
function startCountdown() {
  const dropDate = new Date();
  dropDate.setDate(dropDate.getDate() + 3);

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = dropDate.getTime() - now;

    if (distance < 0) {
      clearInterval(timer);
      document.getElementById('countdown').innerHTML = `<h2 class="text-primary text-shadow">DROP IS LIVE</h2>`;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }, 1000);
}

// Event Listeners
function setupEventListeners() {
  searchInput.addEventListener('input', renderProducts);
  categoryFilter.addEventListener('change', renderProducts);
  sortFilter.addEventListener('change', renderProducts);
  
  priceRange.addEventListener('input', (e) => {
    priceValue.textContent = e.target.value;
    renderProducts();
  });
  
  if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', applyPromo);
  }

  // Cross-Tab Sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'aurora_cart') {
      cart = JSON.parse(e.newValue) || [];
      resetCatalog();
      reconcileStock();
      renderProducts();
      updateCartUI();
      // If modal is open, it might need its stock updated
      const openModalBtn = document.getElementById('quickViewAddToCartBtn');
      if (openModalBtn && openModalBtn.hasAttribute('onclick')) {
        const idMatch = openModalBtn.getAttribute('onclick').match(/\d+/);
        if (idMatch) updateQuickViewStock(parseInt(idMatch[0]));
      }
    } else if (e.key === 'aurora_wishlist') {
      wishlist = JSON.parse(e.newValue) || [];
      renderProducts();
      updateWishlistUI();
    }
  });

  // Mock Checkout Form
  const checkoutForm = document.getElementById('checkoutForm');
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!checkoutForm.checkValidity()) {
      e.stopPropagation();
      checkoutForm.classList.add('was-validated');
      return;
    }

    cart = [];
    saveCart();
    updateCartUI();
    resetCatalog();
    reconcileStock();
    renderProducts();
    
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    checkoutModal.hide();
    
    showToast('Order placed successfully! Welcome to the void.');
  });
}

// Run app
document.addEventListener('DOMContentLoaded', init);
