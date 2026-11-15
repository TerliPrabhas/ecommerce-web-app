document.addEventListener('DOMContentLoaded', () => {
  // Global App State
  let activeCategory = 'All';
  let searchQuery = '';
  let activeSort = 'featured';
  let cartData = { items: [], totalAmount: 0, totalItems: 0 };
  let appliedPromo = false;
  let allProductsCache = [];

  // DOM Elements
  const categoriesTabs = document.getElementById('categoriesTabs');
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const sortBySelect = document.getElementById('sortBy');
  const filterStatusBar = document.getElementById('filterStatusBar');
  const activeFilterText = document.getElementById('activeFilterText');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');

  // Cart DOM
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
  const promoFeedback = document.getElementById('promoFeedback');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // Modals DOM
  const themeToggle = document.getElementById('themeToggle');
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const orderSuccessModal = document.getElementById('orderSuccessModal');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');
  const toastContainer = document.getElementById('toastContainer');

  // AI Drawer DOM
  const openAiChatBtn = document.getElementById('openAiChatBtn');
  const heroAiBtn = document.getElementById('heroAiBtn');
  const aiDrawerOverlay = document.getElementById('aiDrawerOverlay');
  const closeAiBtn = document.getElementById('closeAiBtn');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const aiChatInput = document.getElementById('aiChatInput');
  const sendAiBtn = document.getElementById('sendAiBtn');
  const aiQuickPrompts = document.getElementById('aiQuickPrompts');

  // Initialize App
  fetchCategories();
  fetchProducts();
  fetchCart();

  // Theme Toggle
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

  // Search & Filter Events
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

  clearFiltersBtn.addEventListener('click', () => {
    activeCategory = 'All';
    searchQuery = '';
    searchInput.value = '';
    activeSort = 'featured';
    sortBySelect.value = 'featured';
    filterStatusBar.style.display = 'none';
    fetchCategories();
    fetchProducts();
  });

  // Cart Drawer Events
  cartToggleBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
  closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) cartOverlay.classList.remove('active');
  });

  // Modal Close Events
  modalCloseBtn.addEventListener('click', () => productModal.classList.remove('active'));
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.classList.remove('active');
  });

  checkoutCloseBtn.addEventListener('click', () => checkoutModal.classList.remove('active'));
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) checkoutModal.classList.remove('active');
  });

  continueShoppingBtn.addEventListener('click', () => {
    orderSuccessModal.classList.remove('active');
  });

  // Promo Code Handler
  applyPromoBtn.addEventListener('click', () => {
    const code = promoCodeInput.value.trim().toUpperCase();
    if (code === 'PROBO20') {
      appliedPromo = true;
      promoFeedback.innerHTML = `<span style="color: var(--success);"><i class="fa-solid fa-circle-check"></i> Code PROBO20 applied! 20% discount activated.</span>`;
      showToast("Coupon PROBO20 Applied! 20% OFF", "success");
      updateCartTotalsUI();
    } else {
      appliedPromo = false;
      promoFeedback.innerHTML = `<span style="color: var(--danger);"><i class="fa-solid fa-circle-xmark"></i> Invalid code. Try PROBO20</span>`;
      updateCartTotalsUI();
    }
  });

  // Checkout Button in Drawer
  checkoutBtn.addEventListener('click', () => {
    if (cartData.items.length === 0) {
      showToast("Your cart is empty! Add items first.", "error");
      return;
    }
    cartOverlay.classList.remove('active');
    checkoutModal.classList.add('active');
  });

  // Checkout Form Submission
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const shipName = document.getElementById('shipName').value;
    const shipEmail = document.getElementById('shipEmail').value;
    const shipAddress = document.getElementById('shipAddress').value;
    const shipCity = document.getElementById('shipCity').value;
    const shipZip = document.getElementById('shipZip').value;
    const payMethod = document.querySelector('input[name="payMethod"]:checked').value;

    const confirmBtn = document.getElementById('confirmOrderBtn');
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...`;

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: { fullName: shipName, email: shipEmail, address: shipAddress, city: shipCity, zipCode: shipZip },
          paymentMethod: payMethod,
          promoCode: appliedPromo ? 'PROBO20' : null
        })
      });

      const data = await res.json();
      if (data.success) {
        checkoutModal.classList.remove('active');
        showOrderSuccess(data.order);
        appliedPromo = false;
        promoCodeInput.value = '';
        promoFeedback.innerHTML = '';
        fetchCart();
      } else {
        showToast(data.message || "Checkout failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error during checkout.", "error");
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = `<i class="fa-solid fa-check"></i> Place & Confirm Order`;
    }
  });

  // Show Order Success Modal
  function showOrderSuccess(order) {
    document.getElementById('successOrderId').textContent = order.orderId;
    const receiptBox = document.getElementById('receiptBox');
    receiptBox.innerHTML = `
      <div style="margin-bottom: 0.75rem; font-weight: 600; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
        Order Breakdown
      </div>
      ${order.items.map(it => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; color: var(--text-secondary);">
          <span>${it.name} (x${it.quantity})</span>
          <span>$${(it.price * it.quantity).toFixed(2)}</span>
        </div>
      `).join('')}
      <div style="border-top: 1px solid var(--border-color); margin-top: 0.5rem; padding-top: 0.5rem;">
        <div style="display: flex; justify-content: space-between;">
          <span>Subtotal:</span> <span>$${order.summary.subtotal.toFixed(2)}</span>
        </div>
        ${order.summary.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; color: var(--success);">
            <span>Discount (PROBO20):</span> <span>-$${order.summary.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between;">
          <span>Tax (8%):</span> <span>$${order.summary.tax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-primary); margin-top: 0.4rem;">
          <span>Total Paid:</span> <span>$${order.summary.finalTotal.toFixed(2)}</span>
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">
          Payment: ${order.paymentMethod} &bull; Delivered to: ${order.shippingAddress.address}, ${order.shippingAddress.city}
        </div>
      </div>
    `;
    orderSuccessModal.classList.add('active');
  }

  // ==========================================
  // CATALOG & PRODUCTS LOGIC
  // ==========================================

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        renderCategories(data.categories);
      }
    } catch (err) {
      console.error("Categories fetch error:", err);
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

  async function fetchProducts() {
    try {
      let url = `/api/products?category=${encodeURIComponent(activeCategory)}&search=${encodeURIComponent(searchQuery)}&sortBy=${activeSort}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        allProductsCache = data.products;
        renderProducts(data.products);

        // Update status bar if filtering active
        if (activeCategory !== 'All' || searchQuery !== '') {
          filterStatusBar.style.display = 'flex';
          activeFilterText.textContent = `Filtered by: ${activeCategory !== 'All' ? activeCategory : ''} ${searchQuery ? `"${searchQuery}"` : ''} (${data.count} items found)`;
        } else {
          filterStatusBar.style.display = 'none';
        }
      }
    } catch (err) {
      console.error("Products fetch error:", err);
    }
  }

  function renderProducts(products) {
    if (!products || products.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <i class="fa-solid fa-box-open" style="font-size: 3.5rem; color: var(--accent-primary); margin-bottom: 1rem;"></i>
          <h3>No matching gear found</h3>
          <p>Try searching with another keyword or explore all categories.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = products.map(p => `
      <div class="product-card" data-id="${p.id}">
        <div class="product-image-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <span class="category-tag">${p.category}</span>
          <h3 class="product-title">${p.name}</h3>
          <div class="rating-bar">
            <i class="fa-solid fa-star"></i>
            <span>${p.rating}</span>
            <span class="rating-count">(${p.reviewsCount} reviews)</span>
          </div>
          <div class="price-row-card">
            <span class="current-price">$${p.price.toFixed(2)}</span>
            ${p.originalPrice ? `<span class="old-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="card-actions">
            <button class="add-cart-btn" data-action="add-cart" data-id="${p.id}">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
            <button class="quick-view-btn" data-action="quick-view" data-id="${p.id}" title="Quick View & AI Review Summary">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach card action listeners
    document.querySelectorAll('[data-action="add-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(parseInt(btn.dataset.id));
      });
    });

    document.querySelectorAll('[data-action="quick-view"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openQuickView(parseInt(btn.dataset.id));
      });
    });
  }

  // Quick View Modal
  function openQuickView(productId) {
    const product = allProductsCache.find(p => p.id === productId);
    if (!product) return;

    modalBody.innerHTML = `
      <div class="modal-grid">
        <div class="modal-img-wrap">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
          <span class="category-tag">${product.category}</span>
          <h2>${product.name}</h2>
          <div class="rating-bar">
            <i class="fa-solid fa-star"></i>
            <span>${product.rating}</span>
            <span class="rating-count">(${product.reviewsCount} verified reviews)</span>
          </div>
          <div class="modal-price-row">
            <span class="current-price" style="font-size: 1.8rem;">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="old-price" style="font-size: 1.1rem;">$${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <p class="modal-desc">${product.description}</p>

          <table class="specs-table">
            <tbody>
              ${product.specs ? Object.entries(product.specs).map(([k, v]) => `
                <tr>
                  <td><strong>${k}</strong></td>
                  <td>${v}</td>
                </tr>
              `).join('') : ''}
            </tbody>
          </table>

          <!-- GenAI Review Summary Section -->
          <div class="ai-summary-box">
            <div class="ai-summary-title">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Aura GenAI Review Synthesis
            </div>
            <ul class="ai-summary-list">
              ${(product.aiSummary?.pros || []).map(pr => `<li><i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 0.75rem; margin-right: 0.35rem;"></i> ${pr}</li>`).join('')}
              ${(product.aiSummary?.cons || []).map(cn => `<li><i class="fa-solid fa-circle-info" style="color: var(--warning); font-size: 0.75rem; margin-right: 0.35rem;"></i> ${cn}</li>`).join('')}
            </ul>
            <div class="ai-verdict">
              <strong>AI Verdict:</strong> ${product.aiSummary?.verdict || "Consistently acclaimed for durability, ergonomics, and daily workflow utility."}
            </div>
          </div>

          <button class="btn btn-primary btn-block" onclick="window.addToCart(${product.id}); document.getElementById('productModal').classList.remove('active');">
            <i class="fa-solid fa-cart-plus"></i> Add to Shopping Cart
          </button>
        </div>
      </div>
    `;

    productModal.classList.add('active');
  }

  // ==========================================
  // CART OPERATIONS
  // ==========================================

  window.addToCart = async function(productId, qty = 1) {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: qty })
      });
      const data = await res.json();
      if (data.success) {
        cartData = { items: data.cart, totalAmount: data.totalAmount, totalItems: data.totalItems };
        renderCartUI();
        showToast("Item added to cart!", "success");
      }
    } catch (err) {
      console.error("Cart add error:", err);
    }
  };

  async function fetchCart() {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success) {
        cartData = { items: data.cart, totalAmount: data.totalAmount, totalItems: data.totalItems };
        renderCartUI();
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  }

  async function updateCartItemQuantity(productId, quantityDelta) {
    await window.addToCart(productId, quantityDelta);
  }

  async function removeCartItem(productId) {
    try {
      const res = await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        cartData = { items: data.cart, totalAmount: data.totalAmount, totalItems: data.totalItems };
        renderCartUI();
        showToast("Item removed from cart.", "success");
      }
    } catch (err) {
      console.error("Cart remove error:", err);
    }
  }

  function renderCartUI() {
    cartBadge.textContent = cartData.totalItems;

    if (cartData.items.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h4>Your cart is empty</h4>
          <p style="font-size: 0.85rem; margin-top: 0.4rem;">Browse our catalog or ask Aura AI for recommendations!</p>
        </div>
      `;
    } else {
      cartItemsList.innerHTML = cartData.items.map(item => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="qty-controls">
              <button class="qty-btn" data-action="qty-dec" data-id="${item.id}">-</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn" data-action="qty-inc" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="remove-item-btn" data-action="remove" data-id="${item.id}" title="Remove">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `).join('');

      cartItemsList.querySelectorAll('[data-action="qty-inc"]').forEach(b => {
        b.addEventListener('click', () => updateCartItemQuantity(parseInt(b.dataset.id), 1));
      });
      cartItemsList.querySelectorAll('[data-action="qty-dec"]').forEach(b => {
        b.addEventListener('click', () => updateCartItemQuantity(parseInt(b.dataset.id), -1));
      });
      cartItemsList.querySelectorAll('[data-action="remove"]').forEach(b => {
        b.addEventListener('click', () => removeCartItem(parseInt(b.dataset.id)));
      });
    }

    updateCartTotalsUI();
  }

  function updateCartTotalsUI() {
    const subtotal = cartData.totalAmount;
    let discount = 0;

    if (appliedPromo) {
      discount = subtotal * 0.20;
      discountRow.style.display = 'flex';
      discountVal.textContent = `-$${discount.toFixed(2)}`;
    } else {
      discountRow.style.display = 'none';
    }

    const tax = (subtotal - discount) * 0.08;
    const finalTotal = subtotal - discount + tax;

    subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    taxVal.textContent = `$${tax.toFixed(2)}`;
    totalVal.textContent = `$${finalTotal.toFixed(2)}`;
  }

  // ==========================================
  // GEN AI CONCIERGE DRAWER LOGIC
  // ==========================================

  const toggleAiDrawer = () => aiDrawerOverlay.classList.toggle('active');
  openAiChatBtn.addEventListener('click', toggleAiDrawer);
  heroAiBtn.addEventListener('click', () => {
    aiDrawerOverlay.classList.add('active');
  });
  closeAiBtn.addEventListener('click', () => aiDrawerOverlay.classList.remove('active'));
  aiDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === aiDrawerOverlay) aiDrawerOverlay.classList.remove('active');
  });

  // Handle Quick Prompt Chips
  document.querySelectorAll('.prompt-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      aiChatInput.value = prompt;
      sendAiMessage();
    });
  });

  sendAiBtn.addEventListener('click', sendAiMessage);
  aiChatInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') sendAiMessage();
  });

  async function sendAiMessage() {
    const text = aiChatInput.value.trim();
    if (!text) return;

    // Append User Message Bubble
    appendChatMessage('user', text);
    aiChatInput.value = '';

    // Append Typing Indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'ai-message bot typing';
    typingIndicator.innerHTML = `
      <div class="message-bubble" style="display: flex; gap: 0.35rem; align-items: center;">
        <span class="fa-solid fa-spinner fa-spin" style="color: var(--accent-primary);"></span>
        <span>Aura is analyzing catalog & recommendations...</span>
      </div>
    `;
    aiChatMessages.appendChild(typingIndicator);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      typingIndicator.remove();

      if (data.success) {
        appendChatMessage('bot', data.reply, data.recommendedProducts);

        // Update Quick Prompt chips if provided
        if (data.suggestedPrompts && data.suggestedPrompts.length > 0) {
          aiQuickPrompts.innerHTML = data.suggestedPrompts.map(p => `
            <button class="prompt-chip" data-prompt="${p}"><i class="fa-solid fa-bolt"></i> ${p}</button>
          `).join('');

          aiQuickPrompts.querySelectorAll('.prompt-chip').forEach(b => {
            b.addEventListener('click', () => {
              aiChatInput.value = b.dataset.prompt;
              sendAiMessage();
            });
          });
        }
      }
    } catch (err) {
      typingIndicator.remove();
      appendChatMessage('bot', "I encountered a minor network issue. Please feel free to ask again!");
    }
  }

  function appendChatMessage(sender, text, recommendations = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${sender}`;

    // Format markdown bolding if present
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    let html = `<div class="message-bubble"><p>${formattedText}</p></div>`;

    // Append interactive recommended product mini-cards inside the bot message
    if (recommendations && recommendations.length > 0) {
      html += recommendations.map(p => `
        <div class="ai-product-recommendation">
          <img class="ai-product-img" src="${p.image}" alt="${p.name}">
          <div class="ai-product-details">
            <div class="ai-product-name">${p.name}</div>
            <div class="ai-product-price">$${p.price.toFixed(2)}</div>
          </div>
          <button class="add-cart-btn" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;" onclick="window.addToCart(${p.id})">
            + Add
          </button>
        </div>
      `).join('');
    }

    msgDiv.innerHTML = html;
    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
