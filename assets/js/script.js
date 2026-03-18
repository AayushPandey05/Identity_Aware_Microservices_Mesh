document.addEventListener('DOMContentLoaded', () => {

  const { categories, restaurants } = window.appData;

  // --- HTML Elements --- //
  const homeView = document.getElementById('home-view');
  const restaurantView = document.getElementById('restaurant-view');
  const dynamicCarousel = document.getElementById('dynamic-carousel');
  const dynamicGrid = document.getElementById('dynamic-grid');
  const filterContainer = document.getElementById('filter-container');
  
  const resInfoHeader = document.getElementById('restaurant-info-header');
  const menuContainer = document.getElementById('menu-container');
  const backToHomeBtn = document.getElementById('back-to-home');

  const cartCountElem = document.querySelector('.cart-count');
  const cartSidebar = document.getElementById('cart-sidebar');
  const openCartBtn = document.getElementById('open-cart-sidebar');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartFooter = document.getElementById('cart-footer');
  const emptyCartState = document.getElementById('empty-cart-state');
  const cartTotalPriceElem = document.getElementById('cart-total-price');
  const checkoutBtn = document.getElementById('checkout-btn');

  const searchOverlay = document.getElementById('search-overlay');
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const liveSearchInput = document.getElementById('live-search-input');
  const searchResultsGrid = document.getElementById('search-results-grid');

  // --- App State --- //
  let currentRestaurants = [...restaurants];
  let cart = []; // Array of { id, name, price, qty, isVeg }
  let currentOpenRestaurant = null;

  // --- HOME VIEW RENDER --- //
  function renderCarousel() {
    dynamicCarousel.innerHTML = categories.map(cat => `
      <div class="mind-item">
        <img src="${cat.image}" alt="${cat.name}">
      </div>
    `).join('');
  }

  function renderGrid(restaurantsArray, container = dynamicGrid, isSearch = false) {
    if (restaurantsArray.length === 0) {
      container.innerHTML = `<div>No restaurants found.</div>`;
      return;
    }

    container.innerHTML = restaurantsArray.map(res => `
      <a href="#" class="swiggy-card" data-id="${res.id}">
        <div class="card-img-wrapper">
          ${res.freeDelivery ? '<div class="free-delivery-badge">Free Delivery</div>' : ''}
          <img src="${res.image}" alt="${res.name}">
          <div class="card-gradient-overlay"></div>
          <div class="offer-text">${res.offerText}</div>
        </div>
        <div class="card-info">
          <div class="res-name">${res.name}</div>
          <div class="res-rating-line">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#11823B"/><path d="M10 13.34L6.46 15.65 7.42 11.5 4.19 8.85 8.35 8.5 10 4.6l1.65 3.9 4.16.35-3.23 2.65.96 4.15L10 13.34z" fill="#FFF"/></svg>
            <span class="rating-text">${res.rating}</span>
            <span class="dot-separator">•</span>
            <span class="eta-text">${res.eta}</span>
          </div>
          <div class="res-cuisines">${res.cuisines}</div>
        </div>
      </a>
    `).join('');

    // Routing Logic to Restaurant View
    const anchorCards = container.querySelectorAll('.swiggy-card');
    anchorCards.forEach(card => card.addEventListener('click', (e) => {
      e.preventDefault();
      if(isSearch) closeSearchOverlay();
      const resId = card.getAttribute('data-id');
      openRestaurantView(resId);
    }));
  }

  filterContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('swiggy-pill')) {
      const type = e.target.getAttribute('data-filter');
      document.querySelectorAll('.swiggy-pill').forEach(p => p.style.backgroundColor = 'var(--bg-white)');
      e.target.style.backgroundColor = 'var(--border-light)';

      switch(type) {
        case 'rating': currentRestaurants = restaurants.filter(r => r.rating >= 4.0); break;
        case 'veg': currentRestaurants = restaurants.filter(r => r.isVeg); break;
        case 'fast': currentRestaurants = restaurants.filter(r => r.fastDelivery); break;
        default: currentRestaurants = [...restaurants];
      }
      renderGrid(currentRestaurants);
    }
  });


  // --- RESTAURANT DETAIL VIEW ROUTING --- //
  function openRestaurantView(resId) {
    const restaurant = restaurants.find(r => r.id === resId);
    if(!restaurant) return;
    currentOpenRestaurant = restaurant;

    // Render Header
    resInfoHeader.innerHTML = `
      <h1>${restaurant.name}</h1>
      <div class="res-rating-line">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#11823B"/><path d="M10 13.34L6.46 15.65 7.42 11.5 4.19 8.85 8.35 8.5 10 4.6l1.65 3.9 4.16.35-3.23 2.65.96 4.15L10 13.34z" fill="#FFF"/></svg>
        <span class="rating-text">${restaurant.rating}</span>
        <span class="dot-separator">•</span>
        <span class="eta-text">${restaurant.eta}</span>
      </div>
      <p style="color: var(--text-secondary); margin-top:4px;">${restaurant.cuisines}</p>
    `;

    // Render Menu Array
    menuContainer.innerHTML = restaurant.menu.map(item => `
      <div class="menu-item">
        <div class="menu-info">
          <span class="veg-icon ${item.isVeg ? 'veg' : 'non-veg'}"></span>
          <h3>${item.name}</h3>
          <div class="menu-price">₹${item.price}</div>
          <p class="menu-desc">${item.desc}</p>
        </div>
        <div class="menu-action">
          <button class="add-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">ADD</button>
        </div>
      </div>
    `).join('');

    // Attach Cart Action
    menuContainer.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        addToCart(
          e.target.getAttribute('data-id'),
          e.target.getAttribute('data-name'),
          parseInt(e.target.getAttribute('data-price'))
        );
      });
    });

    // View Toggle
    homeView.classList.add('hidden');
    restaurantView.classList.remove('hidden');
    window.scrollTo(0,0);
  }

  backToHomeBtn.addEventListener('click', () => {
    restaurantView.classList.add('hidden');
    homeView.classList.remove('hidden');
    currentOpenRestaurant = null;
  });

  // Nav Logo acts as home button
  document.querySelector('.logo-box').addEventListener('click', () => {
    restaurantView.classList.add('hidden');
    homeView.classList.remove('hidden');
    closeSearchOverlay();
  });
  document.addEventListener('nav-home', () => {
    restaurantView.classList.add('hidden');
    homeView.classList.remove('hidden');
  });


  // --- CART MANAGER SYSTEM --- //
  function addToCart(id, name, price) {
    const existingIndex = cart.findIndex(item => item.id === id);
    if(existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    updateCartUI();
    showToast('success', `Added ${name} to cart.`);
  }

  function updateCartQuantity(id, delta) {
    const existingIndex = cart.findIndex(item => item.id === id);
    if(existingIndex > -1) {
      cart[existingIndex].qty += delta;
      if(cart[existingIndex].qty <= 0) {
        cart.splice(existingIndex, 1);
      }
    }
    updateCartUI();
  }

  function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
      totalItems += item.qty;
      totalPrice += (item.qty * item.price);
      return `
        <div class="cart-item">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-controls">
            <button class="qty-btn minus" data-id="${item.id}">-</button>
            <div class="qty-val">${item.qty}</div>
            <button class="qty-btn plus" data-id="${item.id}">+</button>
          </div>
          <div class="cart-item-price">₹${item.price * item.qty}</div>
        </div>
      `;
    }).join('');

    cartCountElem.textContent = totalItems;
    cartTotalPriceElem.textContent = `₹${totalPrice}`;

    if(cart.length > 0) {
      emptyCartState.classList.add('hidden');
      cartFooter.classList.remove('hidden');
    } else {
      emptyCartState.classList.remove('hidden');
      cartFooter.classList.add('hidden');
    }

    // Attach +/- listeners
    cartItemsContainer.querySelectorAll('.minus').forEach(btn => {
      btn.addEventListener('click', (e) => updateCartQuantity(e.target.getAttribute('data-id'), -1));
    });
    cartItemsContainer.querySelectorAll('.plus').forEach(btn => {
      btn.addEventListener('click', (e) => updateCartQuantity(e.target.getAttribute('data-id'), 1));
    });
  }

  checkoutBtn.addEventListener('click', () => {
    showToast('success', 'Processing order via simulated Kafka backend...');
    setTimeout(() => {
      cart = [];
      updateCartUI();
      closeCartOverlay();
      showToast('success', 'Order Placed Successfully! Generating Invoice.');
    }, 1500);
  });

  // Cart Modal Toggles
  function openCartOverlay() {
    cartSidebar.classList.add('active');
    document.getElementById('modal-backdrop').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCartOverlay() {
    cartSidebar.classList.remove('active');
    document.getElementById('modal-backdrop').classList.remove('active');
    document.body.style.overflow = '';
  }
  openCartBtn.addEventListener('click', openCartOverlay);
  closeCartBtn.addEventListener('click', closeCartOverlay);


  // --- LIVE FAST SEARCH ENGINE --- //
  function openSearchOverlay() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    liveSearchInput.value = '';
    searchResultsGrid.innerHTML = ''; // Start clean
    liveSearchInput.focus();
  }
  function closeSearchOverlay() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  openSearchBtn.addEventListener('click', openSearchOverlay);
  closeSearchBtn.addEventListener('click', closeSearchOverlay);

  liveSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if(query.length === 0) {
      searchResultsGrid.innerHTML = '';
      return;
    }

    // Search against Restaurant Name OR Food Item Name inside menu
    const matchingRes = restaurants.filter(r => {
      const matchName = r.name.toLowerCase().includes(query);
      const matchCuisine = r.cuisines.toLowerCase().includes(query);
      const matchMenu = r.menu.some(m => m.name.toLowerCase().includes(query));
      return matchName || matchCuisine || matchMenu;
    });

    renderGrid(matchingRes, searchResultsGrid, true);
  });


  // --- AUTH MODAL SYSTEM (Phase 4 Logic) --- //
  const signupModalBtn = document.getElementById('open-signin-modal');
  const closeAuthModalBtn = document.getElementById('close-modal-btn');
  const authModal = document.getElementById('auth-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const form = document.getElementById('registration-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');
  
  const toastContainer = document.getElementById('toast-container');

  function updateNavProfile(name) {
    const firstName = name.split(' ')[0];
    signupModalBtn.innerHTML = `
      <svg viewBox="0 0 24 24" class="nav-icon"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#3d4152"></path></svg>
      Logout (${firstName})
    `;
    signupModalBtn.removeEventListener('click', openAuthModal);
    signupModalBtn.addEventListener('click', () => {
      localStorage.removeItem('foodapp_user');
      window.location.href = 'login.html';
    });
  }

  const savedUser = localStorage.getItem('foodapp_user');
  if(savedUser) {
    updateNavProfile(savedUser);
  }

  function openAuthModal() {
    authModal.classList.add('active');
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAuthModal() {
    authModal.classList.remove('active');
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  signupModalBtn.addEventListener('click', openAuthModal);
  closeAuthModalBtn.addEventListener('click', closeAuthModal);
  modalBackdrop.addEventListener('click', () => {
    closeAuthModal();
    closeCartOverlay();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    btnText.textContent = 'CREATING ACCOUNT...';
    spinner.classList.remove('hidden');

    const fullnameInput = document.getElementById('fullname');
    const fullname = fullnameInput ? fullnameInput.value : 'User';

    setTimeout(() => {
        localStorage.setItem('foodapp_user', fullname);
        updateNavProfile(fullname);
        showToast('success', `Welcome ${fullname}! JWT Verified. Account created successfully.`);
        
        submitBtn.disabled = false;
        btnText.textContent = 'SIGN UP';
        spinner.classList.add('hidden');
        closeAuthModal();
        form.reset();
    }, 1200);
  });

  function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fadeOut');
      toast.addEventListener('animationend', () => toast.remove());
    }, 4000);
  }

  // --- Initial Render ---
  renderCarousel();
  renderGrid(currentRestaurants);

});
