document.addEventListener("DOMContentLoaded", () => {
  // --- AUTH GUARD: Redirect to login if not authenticated ---
  const savedUser = localStorage.getItem("foodapp_user");
  if (!savedUser) {
    // Agar user logged in nahi hai, toh seedha index.html (Login) par bhej do
    if (
      !window.location.pathname.endsWith("index.html") &&
      !window.location.pathname.endsWith("/")
    ) {
      window.location.href = "index.html";
      return;
    }
  }

  const { categories, restaurants } = window.appData;

  // --- HTML Elements --- //
  const homeView = document.getElementById("home-view");
  const restaurantView = document.getElementById("restaurant-view");
  const dynamicCarousel = document.getElementById("dynamic-carousel");
  const dynamicGrid = document.getElementById("dynamic-grid");
  const filterContainer = document.getElementById("filter-container");

  const resInfoHeader = document.getElementById("restaurant-info-header");
  const menuContainer = document.getElementById("menu-container");
  const backToHomeBtn = document.getElementById("back-to-home");

  const cartCountElem = document.querySelector(".cart-count");
  const cartSidebar = document.getElementById("cart-sidebar");
  const openCartBtn = document.getElementById("open-cart-sidebar");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartFooter = document.getElementById("cart-footer");
  const emptyCartState = document.getElementById("empty-cart-state");
  const cartTotalPriceElem = document.getElementById("cart-total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  const searchOverlay = document.getElementById("search-overlay");
  const openSearchBtn = document.getElementById("open-search-btn");
  const closeSearchBtn = document.getElementById("close-search-btn");
  const liveSearchInput = document.getElementById("live-search-input");
  const searchResultsGrid = document.getElementById("search-results-grid");

  const signupModalBtn = document.getElementById("open-signin-modal");
  const closeAuthModalBtn = document.getElementById("close-modal-btn");
  const authModal = document.getElementById("auth-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const form = document.getElementById("registration-form");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = submitBtn ? submitBtn.querySelector(".btn-text") : null;
  const spinner = submitBtn ? submitBtn.querySelector(".spinner") : null;
  const toastContainer = document.getElementById("toast-container");

  // --- App State --- //
  let currentRestaurants = [...restaurants];
  let cart = [];
  let currentOpenRestaurant = null;

  // --- HOME VIEW RENDER --- //
  function renderCarousel() {
    if (!dynamicCarousel) return;
    dynamicCarousel.innerHTML = categories
      .map(
        (cat) => `
      <div class="mind-item">
        <img src="${cat.image}" alt="${cat.name}">
      </div>
    `,
      )
      .join("");
  }

  function renderGrid(
    restaurantsArray,
    container = dynamicGrid,
    isSearch = false,
  ) {
    if (!container) return;
    if (restaurantsArray.length === 0) {
      container.innerHTML = `<div>No restaurants found.</div>`;
      return;
    }

    container.innerHTML = restaurantsArray
      .map(
        (res) => `
      <a href="#" class="swiggy-card" data-id="${res.id}">
        <div class="card-img-wrapper">
          ${res.freeDelivery ? '<div class="free-delivery-badge">Free Delivery</div>' : ""}
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
    `,
      )
      .join("");

    const anchorCards = container.querySelectorAll(".swiggy-card");
    anchorCards.forEach((card) =>
      card.addEventListener("click", (e) => {
        e.preventDefault();
        if (isSearch) closeSearchOverlay();
        const resId = card.getAttribute("data-id");
        openRestaurantView(resId);
      }),
    );
  }

  if (filterContainer) {
    filterContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("swiggy-pill")) {
        const type = e.target.getAttribute("data-filter");
        document
          .querySelectorAll(".swiggy-pill")
          .forEach((p) => (p.style.backgroundColor = "var(--bg-white)"));
        e.target.style.backgroundColor = "var(--border-light)";

        switch (type) {
          case "rating":
            currentRestaurants = restaurants.filter((r) => r.rating >= 4.0);
            break;
          case "veg":
            currentRestaurants = restaurants.filter((r) => r.isVeg);
            break;
          case "fast":
            currentRestaurants = restaurants.filter((r) => r.fastDelivery);
            break;
          default:
            currentRestaurants = [...restaurants];
        }
        renderGrid(currentRestaurants);
      }
    });
  }

  function openRestaurantView(resId) {
    const restaurant = restaurants.find((r) => r.id === resId);
    if (!restaurant) return;
    currentOpenRestaurant = restaurant;

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

    menuContainer.innerHTML = restaurant.menu
      .map(
        (item) => `
      <div class="menu-item">
        <div class="menu-info">
          <span class="veg-icon ${item.isVeg ? "veg" : "non-veg"}"></span>
          <h3>${item.name}</h3>
          <div class="menu-price">₹${item.price}</div>
          <p class="menu-desc">${item.desc}</p>
        </div>
        <div class="menu-action">
          <button class="add-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">ADD</button>
        </div>
      </div>
    `,
      )
      .join("");

    menuContainer.querySelectorAll(".add-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        addToCart(
          e.target.getAttribute("data-id"),
          e.target.getAttribute("data-name"),
          parseInt(e.target.getAttribute("data-price")),
        );
      });
    });

    homeView.classList.add("hidden");
    restaurantView.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", () => {
      restaurantView.classList.add("hidden");
      homeView.classList.remove("hidden");
      currentOpenRestaurant = null;
    });
  }

  const logoBox = document.querySelector(".logo-box");
  if (logoBox) {
    logoBox.addEventListener("click", () => {
      restaurantView.classList.add("hidden");
      homeView.classList.remove("hidden");
      closeSearchOverlay();
    });
  }

  document.addEventListener("nav-home", () => {
    restaurantView.classList.add("hidden");
    homeView.classList.remove("hidden");
  });

  // --- CART MANAGER SYSTEM --- //
  function addToCart(id, name, price) {
    const existingIndex = cart.findIndex((item) => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    updateCartUI();
    showToast("success", `Added ${name} to cart.`);
  }

  function updateCartQuantity(id, delta) {
    const existingIndex = cart.findIndex((item) => item.id === id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += delta;
      if (cart[existingIndex].qty <= 0) {
        cart.splice(existingIndex, 1);
      }
    }
    updateCartUI();
  }

  function updateCartUI() {
    let totalItems = 0;
    let totalPrice = 0;

    cartItemsContainer.innerHTML = cart
      .map((item) => {
        totalItems += item.qty;
        totalPrice += item.qty * item.price;
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
      })
      .join("");

    if (cartCountElem) cartCountElem.textContent = totalItems;
    if (cartTotalPriceElem) cartTotalPriceElem.textContent = `₹${totalPrice}`;

    if (cart.length > 0) {
      if (emptyCartState) emptyCartState.classList.add("hidden");
      if (cartFooter) cartFooter.classList.remove("hidden");
    } else {
      if (emptyCartState) emptyCartState.classList.remove("hidden");
      if (cartFooter) cartFooter.classList.add("hidden");
    }

    cartItemsContainer.querySelectorAll(".minus").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        updateCartQuantity(e.target.getAttribute("data-id"), -1),
      );
    });
    cartItemsContainer.querySelectorAll(".plus").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        updateCartQuantity(e.target.getAttribute("data-id"), 1),
      );
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      showToast("success", "Processing order via simulated Kafka backend...");
      setTimeout(() => {
        cart = [];
        updateCartUI();
        closeCartOverlay();
        showToast("success", "Order Placed Successfully! Generating Invoice.");
      }, 1500);
    });
  }

  // Cart Modal Toggles
  function openCartOverlay() {
    if (cartSidebar) cartSidebar.classList.add("active");
    if (modalBackdrop) modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeCartOverlay() {
    if (cartSidebar) cartSidebar.classList.remove("active");
    if (modalBackdrop) modalBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
  if (openCartBtn) openCartBtn.addEventListener("click", openCartOverlay);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartOverlay);

  // --- LIVE FAST SEARCH ENGINE --- //
  function openSearchOverlay() {
    if (searchOverlay) searchOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    if (liveSearchInput) {
      liveSearchInput.value = "";
      liveSearchInput.focus();
    }
    if (searchResultsGrid) searchResultsGrid.innerHTML = "";
  }
  function closeSearchOverlay() {
    if (searchOverlay) searchOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }
  if (openSearchBtn) openSearchBtn.addEventListener("click", openSearchOverlay);
  if (closeSearchBtn)
    closeSearchBtn.addEventListener("click", closeSearchOverlay);

  if (liveSearchInput) {
    liveSearchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length === 0) {
        searchResultsGrid.innerHTML = "";
        return;
      }
      const matchingRes = restaurants.filter((r) => {
        const matchName = r.name.toLowerCase().includes(query);
        const matchCuisine = r.cuisines.toLowerCase().includes(query);
        const matchMenu = r.menu.some((m) =>
          m.name.toLowerCase().includes(query),
        );
        return matchName || matchCuisine || matchMenu;
      });
      renderGrid(matchingRes, searchResultsGrid, true);
    });
  }

  // --- AUTH SYSTEM UPDATED --- //
  function updateNavProfile(name) {
    if (!signupModalBtn) return;
    const firstName = name.split(" ")[0];

    // Change UI to Logout button
    signupModalBtn.innerHTML = `
      <svg viewBox="0 0 24 24" class="nav-icon"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#3d4152"></path></svg>
      Logout (${firstName})
    `;

    // Remove default modal opener and add Logout logic
    signupModalBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("foodapp_user");
      localStorage.removeItem("authToken"); // Clean up everything
      window.location.href = "index.html"; // Redirect to new entry point
    };
  }

  if (savedUser) {
    updateNavProfile(savedUser);
  } else {
    if (signupModalBtn) signupModalBtn.onclick = openAuthModal;
  }

  function openAuthModal() {
    if (authModal) authModal.classList.add("active");
    if (modalBackdrop) modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeAuthModal() {
    if (authModal) authModal.classList.remove("active");
    if (modalBackdrop) modalBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (closeAuthModalBtn)
    closeAuthModalBtn.addEventListener("click", closeAuthModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", () => {
      closeAuthModal();
      closeCartOverlay();
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = "CREATING ACCOUNT...";
      if (spinner) spinner.classList.remove("hidden");

      const fullnameInput = document.getElementById("fullName");
      const fullname = fullnameInput ? fullnameInput.value : "User";

      setTimeout(() => {
        localStorage.setItem("foodapp_user", fullname);
        updateNavProfile(fullname);
        showToast(
          "success",
          `Welcome ${fullname}! Account created successfully.`,
        );

        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = "SIGN UP";
        if (spinner) spinner.classList.add("hidden");
        closeAuthModal();
        form.reset();
      }, 1200);
    });
  }

  function showToast(type, message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("fadeOut");
      toast.addEventListener("animationend", () => toast.remove());
    }, 4000);
  }

  // --- Initial Render ---
  renderCarousel();
  renderGrid(currentRestaurants);
});
