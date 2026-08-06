document.addEventListener('DOMContentLoaded', () => {
  // State Management
  let activeCategory = 'All';
  let searchQuery = '';
  let activeSort = 'featured';
  let cartData = { items: [], totalAmount: 0, totalItems: 0 };
  let appliedPromo = false;

  // DOM Elements
  const categoriesTabs = document.getElementById('categoriesTabs');
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const sortBySelect = document.getElementById('sortBy');
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const subtotalVal = document.getElementById('subtotalVal');
  const discountRow = document.getElementById('discountRow');
  const discountVal = document.getElementById('discountVal');
  const taxVal = document.getElementById('taxVal');
  const totalVal = document.getElementById('totalVal');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const promoCodeInput = document.getElementById('promoCodeInput');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const themeToggle = document.getElementById('themeToggle');
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const toastContainer = document.getElementById('toastContainer');

  // Initial Fetch
  fetchCategories();
  fetchProducts();
  fetchCart();

  // Dark/Light Theme Handler
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.body.removeAttribute('data-theme');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
      document.body.setAttribute('data-theme', 'light');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  });

  // Search & Filter Listeners
  searchBtn.addEventListener('click', () => {
    searchQuery = searchInput.value.trim();
    fetchProducts();
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      searchQuery = searchInput.value.trim();
      fetchProducts();
    }
  });

  sortBySelect.addEventListener('change', (e) => {
    activeSort = e.target.value;
    fetchProducts();
  });

  // Cart Drawer Listeners
  cartToggleBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
  closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) cartOverlay.classList.remove('active');
  });

  // Modal Listeners
  modalCloseBtn.addEventListener('click', () => productModal.classList.remove('active'));
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.classList.remove('active');
  });

  // Apply Promo
  applyPromoBtn.addEventListener('click', () => {
    const code = promoCodeInput.value.trim();
    if (code.toUpperCase() === 'PROBO20') {
      appliedPromo = true;
      showToast("Promo Code PROBO20 applied (20% OFF)!", "success");
      renderCartUI();
    } else {
      showToast("Invalid Promo Code", "error");
    }
  });

  // Checkout Handler
  checkoutBtn.addEventListener('click', async () => {
    if (cartData.items.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: "Default User Address",
          promoCode: appliedPromo ? 'PROBO20' : ''
        })
      });
      const data = await res.json();
      if (data.success) {
        cartOverlay.classList.remove('active');
        appliedPromo = false;
        promoCodeInput.value = '';
        fetchCart();
        showToast(`🎉 ${data.message} Order ID: ${data.orderId}`, "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Checkout failed. Please try again.", "error");
    }
  });

  // Fetch Categories
  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        renderCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }

  function renderCategories(categories) {
    categoriesTabs.innerHTML = categories.map(cat => `
      <button class="chip ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    document.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.category;
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        fetchProducts();
      });
    });
  }

  // Fetch Products
  async function fetchProducts() {
    try {
      let url = `/api/products?category=${encodeURIComponent(activeCategory)}&search=${encodeURIComponent(searchQuery)}&sortBy=${activeSort}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        renderProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    }
  }

  function renderProducts(products) {
    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
          <h3>No products found</h3>
          <p>Try searching for a different keyword or category.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = products.map(p => `
      <div class="product-card">
        <div class="product-image-wrap">
          <img src="${p.image}" alt="${p.name}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <span class="category-tag">${p.category}</span>
          <h3 class="product-title">${p.name}</h3>
          <div class="rating-bar">
            <i class="fa-solid fa-star"></i>
            <span>${p.rating}</span>
            <span class="rating-count">(${p.reviewsCount})</span>
          </div>
          <div class="price-row-card">
            <span class="current-price">$${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span class="old-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="add-cart-btn" onclick="addToCart(${p.id})">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
            <button class="quick-view-btn" onclick="openQuickView(${p.id})" title="Quick Details">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Fetch & Manage Cart
  window.addToCart = async function(productId) {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      const data = await res.json();
      if (data.success) {
        cartData.items = data.cart;
        cartData.totalAmount = data.totalAmount;
        cartData.totalItems = data.totalItems;
        renderCartUI();
        showToast("Item added to cart!", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function fetchCart() {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success) {
        cartData.items = data.cart;
        cartData.totalAmount = data.totalAmount;
        cartData.totalItems = data.totalItems;
        renderCartUI();
      }
    } catch (err) {
      console.error(err);
    }
  }

  window.updateQty = async function(productId, delta) {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: delta })
      });
      const data = await res.json();
      if (data.success) {
        cartData.items = data.cart;
        cartData.totalAmount = data.totalAmount;
        cartData.totalItems = data.totalItems;
        renderCartUI();
      }
    } catch (err) {
      console.error(err);
    }
  };

  window.removeFromCart = async function(productId) {
    try {
      const res = await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        cartData.items = data.cart;
        cartData.totalAmount = data.totalAmount;
        cartData.totalItems = data.totalItems;
        renderCartUI();
        showToast("Item removed from cart", "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  function renderCartUI() {
    cartBadge.textContent = cartData.totalItems;

    if (cartData.items.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <i class="fa-solid fa-basket-shopping" style="font-size: 2.5rem; margin-bottom: 0.8rem;"></i>
          <p>Your shopping cart is empty.</p>
        </div>
      `;
    } else {
      cartItemsList.innerHTML = cartData.items.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="qty-controls">
              <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
          </div>
          <button style="background:none; border:none; color:var(--text-secondary); cursor:pointer;" onclick="removeFromCart(${item.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `).join('');
    }

    let subtotal = cartData.totalAmount;
    let discount = appliedPromo ? subtotal * 0.20 : 0;
    let tax = (subtotal - discount) * 0.08;
    let total = subtotal - discount + tax;

    subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    if (appliedPromo) {
      discountRow.classList.remove('hidden');
      discountVal.textContent = `-$${discount.toFixed(2)}`;
    } else {
      discountRow.classList.add('hidden');
    }
    taxVal.textContent = `$${tax.toFixed(2)}`;
    totalVal.textContent = `$${total.toFixed(2)}`;
  }

  // Quick View Modal
  window.openQuickView = async function(id) {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        const p = data.product;
        modalBody.innerHTML = `
          <div>
            <img src="${p.image}" alt="${p.name}" style="width:100%; border-radius:12px; object-fit:cover; height:300px;">
          </div>
          <div>
            <span class="category-tag">${p.category}</span>
            <h2 style="margin: 0.4rem 0 0.8rem; font-size:1.6rem;">${p.name}</h2>
            <div class="rating-bar" style="margin-bottom:1rem;">
              <i class="fa-solid fa-star"></i> <span>${p.rating}</span> (${p.reviewsCount} verified reviews)
            </div>
            <p style="color:var(--text-secondary); margin-bottom:1.2rem; font-size:0.95rem;">${p.description}</p>
            <div style="background:var(--bg-primary); padding:1rem; border-radius:8px; margin-bottom:1.5rem;">
              <h4 style="font-size:0.9rem; margin-bottom:0.5rem; text-transform:uppercase;">Technical Specifications</h4>
              <ul style="list-style:none; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; font-size:0.85rem; color:var(--text-secondary);">
                ${Object.entries(p.specs || {}).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')}
              </ul>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span class="current-price" style="font-size:1.8rem;">$${p.price.toFixed(2)}</span>
              <button class="btn btn-primary" onclick="addToCart(${p.id}); document.getElementById('productModal').classList.remove('active');">
                <i class="fa-solid fa-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        `;
        productModal.classList.add('active');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toast Helper
  function showToast(message, type = "info") {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}" style="color:${type === 'success' ? '#10b981' : '#6366f1'}"></i>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
