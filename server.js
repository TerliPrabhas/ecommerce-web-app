const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Product Database
const products = [
  {
    id: 1,
    name: "Aura Pro Wireless Headphones",
    category: "Electronics",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewsCount: 124,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description: "Active noise canceling overhead wireless headphones with 40-hour battery life, spatial audio, and ultra-soft memory foam earcups.",
    specs: { "Battery": "40h", "Bluetooth": "v5.3", "Weight": "250g", "Noise Control": "Active ANC" }
  },
  {
    id: 2,
    name: "CyberPulse Mechanical Keyboard",
    category: "Electronics",
    price: 129.50,
    originalPrice: 159.99,
    rating: 4.9,
    reviewsCount: 88,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
    description: "Hot-swappable RGB mechanical keyboard featuring custom linear switches, PBT keycaps, and customizable dynamic lighting effects.",
    specs: { "Switch": "Linear Red", "Keycaps": "PBT Double-shot", "Connectivity": "Tri-Mode", "RGB": "16.8M Colors" }
  },
  {
    id: 3,
    name: "Minimalist Leather Smart Watch",
    category: "Wearables",
    price: 179.00,
    originalPrice: 219.00,
    rating: 4.7,
    reviewsCount: 65,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: "Sleek smartwatch with high-resolution AMOLED display, heart rate monitor, sleep tracking, and genuine Italian leather strap.",
    specs: { "Display": "1.43 AMOLED", "Water Resistance": "5 ATM", "Sensors": "SpO2 & HR", "Strap": "Genuine Leather" }
  },
  {
    id: 4,
    name: "Ultra-Light Ergonomic Gaming Mouse",
    category: "Electronics",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviewsCount: 210,
    badge: "New",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
    description: "59g ultra-lightweight wireless gaming mouse with 26K DPI optical sensor and 80 million click lifespan.",
    specs: { "DPI": "26,000", "Weight": "59g", "Battery": "80h", "Sensor": "PAW3395" }
  },
  {
    id: 5,
    name: "Urban Explorer Waterproof Backpack",
    category: "Accessories",
    price: 89.95,
    originalPrice: 110.00,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Featured",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    description: "Durable weatherproof tech backpack with padded 16-inch laptop sleeve, hidden anti-theft pockets, and integrated USB charging port.",
    specs: { "Capacity": "25L", "Laptop Size": "Up to 16\"", "Material": "Cordura Ballistic Nylon", "Waterproof": "IPX4" }
  },
  {
    id: 6,
    name: "SoundWave Portable Bluetooth Speaker",
    category: "Electronics",
    price: 64.99,
    originalPrice: 84.99,
    rating: 4.5,
    reviewsCount: 97,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    description: "360-degree immersive sound with punchy bass, IP67 dust/waterproof rating, and 15-hour playback time.",
    specs: { "Power": "20W RMS", "Battery": "15h", "Waterproof": "IP67", "Bluetooth": "v5.2" }
  }
];

// In-Memory Shopping Cart Store
let cartStore = [];

// API Routes
app.get('/api/categories', (req, res) => {
  const categories = ["All", ...new Set(products.map(p => p.category))];
  res.json({ success: true, categories });
});

app.get('/api/products', (req, res) => {
  let { category, search, minPrice, maxPrice, sortBy } = req.query;
  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: filtered.length, products: filtered });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
});

app.get('/api/cart', (req, res) => {
  const totalAmount = cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartStore.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ success: true, cart: cartStore, totalAmount, totalItems });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === parseInt(productId));

  if (!product) return res.status(400).json({ success: false, message: "Invalid product" });

  const existingIndex = cartStore.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    cartStore[existingIndex].quantity += quantity;
    if (cartStore[existingIndex].quantity <= 0) {
      cartStore.splice(existingIndex, 1);
    }
  } else if (quantity > 0) {
    cartStore.push({ ...product, quantity });
  }

  const totalAmount = cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartStore.reduce((sum, item) => sum + item.quantity, 0);

  res.json({ success: true, message: "Cart updated", cart: cartStore, totalAmount, totalItems });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  cartStore = cartStore.filter(item => item.id !== id);
  const totalAmount = cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartStore.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ success: true, message: "Item removed", cart: cartStore, totalAmount, totalItems });
});

app.post('/api/checkout', (req, res) => {
  const { shippingAddress, promoCode } = req.body;

  if (cartStore.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  let subtotal = cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;

  if (promoCode && promoCode.toUpperCase() === 'PROBO20') {
    discount = subtotal * 0.20; // 20% discount
  }

  const tax = (subtotal - discount) * 0.08;
  const finalTotal = subtotal - discount + tax;
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  // Clear cart on successful order
  const completedItems = [...cartStore];
  cartStore = [];

  res.json({
    success: true,
    orderId,
    items: completedItems,
    summary: { subtotal, discount, tax, finalTotal },
    message: "Order placed successfully!"
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`E-Commerce Server running on http://localhost:${PORT}`);
});
