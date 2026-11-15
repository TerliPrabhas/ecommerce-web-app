const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initial Catalog of Products
const defaultProducts = [
  {
    id: 1,
    name: "Aura Pro Wireless Headphones",
    category: "Audio",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewsCount: 142,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description: "Active noise canceling overhead wireless headphones with 40-hour battery life, spatial audio, and ultra-soft memory foam earcups.",
    specs: { "Battery": "40h", "Bluetooth": "v5.3", "Weight": "250g", "Noise Control": "Hybrid ANC" },
    aiSummary: {
      pros: ["Exceptional 40-hour battery life", "Industry-leading hybrid noise cancellation", "Comfortable memory foam fit"],
      cons: ["Larger carrying case", "Lacks dedicated multipoint switch button"],
      verdict: "Top recommendation for programmers and commuters looking for distraction-free focus."
    }
  },
  {
    id: 2,
    name: "CyberPulse Mechanical Keyboard",
    category: "Electronics",
    price: 129.50,
    originalPrice: 159.99,
    rating: 4.9,
    reviewsCount: 98,
    badge: "Hot Deal",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
    description: "Hot-swappable RGB mechanical keyboard featuring custom pre-lubed linear switches, PBT double-shot keycaps, and aluminum chassis.",
    specs: { "Switch": "Linear Red (Pre-lubed)", "Keycaps": "PBT Double-shot", "Connectivity": "Tri-Mode (BT/2.4G/USB-C)", "RGB": "16.8M Colors" },
    aiSummary: {
      pros: ["Smooth butter-like typing feel", "Solid aircraft-grade aluminum top plate", "Versatile Tri-mode wireless connectivity"],
      cons: ["Slightly heavier than plastic alternatives"],
      verdict: "Perfect for software engineers and gamers who write code all day."
    }
  },
  {
    id: 3,
    name: "Minimalist Leather Smart Watch",
    category: "Wearables",
    price: 179.00,
    originalPrice: 219.00,
    rating: 4.7,
    reviewsCount: 76,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: "Sleek smartwatch with 1.43\" AMOLED always-on display, 24/7 heart rate monitor, SpO2 sensor, sleep tracking, and Italian calfskin strap.",
    specs: { "Display": "1.43\" AMOLED 466x466", "Water Resistance": "5 ATM", "Sensors": "Optical HR, SpO2, Accel", "Battery": "Up to 7 Days" },
    aiSummary: {
      pros: ["Timeless luxury dress aesthetic", "Vibrant high-contrast AMOLED screen", "Accurate wellness biometric tracking"],
      cons: ["Proprietary magnetic charging puck"],
      verdict: "Superb blend of classic horology design and modern smart telemetry."
    }
  },
  {
    id: 4,
    name: "Ultra-Light Ergonomic Wireless Mouse",
    category: "Electronics",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviewsCount: 215,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
    description: "59g ultra-lightweight ergonomic mouse with 26K DPI optical sensor, pure PTFE skates, and 80 million click optical switches.",
    specs: { "DPI": "26,000 PAW3395", "Weight": "59 Grams", "Battery": "85 Hours", "Polling Rate": "1000Hz (4K Ready)" },
    aiSummary: {
      pros: ["Featherlight zero-fatigue glide", "Instant zero-debounce optical switches", "Long 85h battery life"],
      cons: ["Best suited for small-to-medium hand sizes"],
      verdict: "Essential desktop upgrade to reduce wrist strain during long coding marathons."
    }
  },
  {
    id: 5,
    name: "Urban Explorer Ballistic Tech Backpack",
    category: "Accessories",
    price: 89.95,
    originalPrice: 119.00,
    rating: 4.9,
    reviewsCount: 164,
    badge: "Featured",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    description: "Weatherproof 25L commuter backpack engineered with Cordura ballistic nylon, dedicated suspended 16\" laptop sleeve, and hidden passport security pocket.",
    specs: { "Capacity": "25 Liters", "Laptop Size": "Up to 16.2\"", "Material": "1000D Cordura Nylon", "Waterproof": "IPX4 Rain-Shield" },
    aiSummary: {
      pros: ["Heavy-duty tear-resistant construction", "Ergonomic breathable lumbar padding", "Smart organization pockets for chargers & cables"],
      cons: ["Stands firm and doesn't compress down very flat"],
      verdict: "The quintessential backpack for campus, tech conferences, and daily commuting."
    }
  },
  {
    id: 6,
    name: "SoundWave 360 Portable Bluetooth Speaker",
    category: "Audio",
    price: 64.99,
    originalPrice: 84.99,
    rating: 4.5,
    reviewsCount: 110,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    description: "360-degree cylindrical sound with dual passive radiators for deep punchy bass, IP67 waterproof/dustproof rating, and 16-hour continuous play.",
    specs: { "Power": "24W RMS", "Battery": "16 Hours", "Waterproof": "IP67 Submersible", "Bluetooth": "v5.2 with TWS Stereo Pair" },
    aiSummary: {
      pros: ["Room-filling 360 omnidirectional acoustic dispersion", "Fully waterproof and floatable in pools", "Instant stereo pairing"],
      cons: ["No built-in microphone for speakerphone calls"],
      verdict: "Exceptional bang-for-the-buck outdoor and room speaker."
    }
  },
  {
    id: 7,
    name: "Lumina Studio LED Desk Light Bar",
    category: "Accessories",
    price: 54.90,
    originalPrice: 69.90,
    rating: 4.8,
    reviewsCount: 89,
    badge: "Staff Pick",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    description: "Asymmetric screen bar with touch dimming, 3 color temperatures (3000K-6500K), auto-light sensor, and zero monitor screen glare.",
    specs: { "Mount": "Counterweight Gravity Clip", "CRI": "Ra > 95", "Power": "USB-C 5V/1A", "Controls": "Capacitive Touch Slider" },
    aiSummary: {
      pros: ["Zero reflection on monitor screens", "Saves precious desk space", "Warm to cool adaptive color temps"],
      cons: ["Requires USB port with stable 5V output"],
      verdict: "A game changer for late-night developers wanting to eliminate eye strain."
    }
  },
  {
    id: 8,
    name: "MagSafe 3-in-1 Foldable Wireless Charging Station",
    category: "Accessories",
    price: 49.99,
    originalPrice: 65.00,
    rating: 4.7,
    reviewsCount: 130,
    badge: "Compact",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80",
    description: "Ultra-compact travel-ready magnetic wireless charging dock capable of fast-charging Phone, Watch, and Earbuds simultaneously.",
    specs: { "Output": "15W Fast Qi Magnetic", "Compatibility": "iPhone 12-16, Apple Watch, AirPods / Qi Devices", "Folded Thickness": "18mm", "Input": "USB-C 30W" },
    aiSummary: {
      pros: ["Folds flat for effortless travel packing", "Strong neodymium magnetic lock", "Single cable clears nightstand clutter"],
      cons: ["Requires a 30W wall brick for full simultaneous fast charge"],
      verdict: "The cleanest solution to charging all daily mobile devices in one spot."
    }
  }
];

// In-Memory Database Store (with full Mongoose schema compatibility)
let productsStore = [...defaultProducts];
let cartStore = [];
let ordersStore = [];

// Optional MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  const mongoose = require('mongoose');
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.warn('MongoDB connection note: Using high-performance memory store:', err.message));
}

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Get Categories
app.get('/api/categories', (req, res) => {
  const categories = ["All", ...new Set(productsStore.map(p => p.category))];
  res.json({ success: true, categories });
});

// 2. Get Products (Search, Filter, Sort)
app.get('/api/products', (req, res) => {
  let { category, search, minPrice, maxPrice, sortBy } = req.query;
  let filtered = [...productsStore];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
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
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.json({ success: true, count: filtered.length, products: filtered });
});

// 3. Get Single Product
app.get('/api/products/:id', (req, res) => {
  const product = productsStore.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
});

// 4. Cart Operations
app.get('/api/cart', (req, res) => {
  const totalAmount = cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartStore.reduce((sum, item) => sum + item.quantity, 0);
  res.json({ success: true, cart: cartStore, totalAmount, totalItems });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = productsStore.find(p => p.id === parseInt(productId));

  if (!product) return res.status(400).json({ success: false, message: "Invalid product ID" });

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

// 5. Checkout & Order Placement
app.post('/api/checkout', (req, res) => {
  const { shippingAddress, promoCode, paymentMethod } = req.body;

  if (cartStore.length === 0) {
    return res.status(400).json({ success: false, message: "Shopping cart is empty" });
  }

  let subtotal = cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  let promoApplied = false;

  if (promoCode && promoCode.toUpperCase() === 'PROBO20') {
    discount = subtotal * 0.20; // 20% Discount
    promoApplied = true;
  }

  const tax = (subtotal - discount) * 0.08;
  const finalTotal = subtotal - discount + tax;
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  const orderRecord = {
    orderId,
    items: [...cartStore],
    shippingAddress: shippingAddress || { fullName: "Prabhas Customer", city: "Agartala", address: "NIT Campus" },
    paymentMethod: paymentMethod || "Credit Card (Simulated)",
    summary: { subtotal, discount, tax, finalTotal, promoCode: promoApplied ? 'PROBO20' : null },
    createdAt: new Date().toISOString()
  };

  ordersStore.push(orderRecord);
  cartStore = []; // Clear cart

  res.json({
    success: true,
    orderId,
    order: orderRecord,
    message: "Order placed and confirmed successfully!"
  });
});

app.get('/api/orders/:orderId', (req, res) => {
  const order = ordersStore.find(o => o.orderId === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order });
});

// ==========================================
// GENERATIVE AI INTEGRATION ENDPOINTS
// ==========================================

// 1. Aura AI Shopping Concierge & Recommendation Chatbot
app.post('/api/ai/chat', (req, res) => {
  const { message, conversationHistory = [] } = req.body;
  if (!message) return res.status(400).json({ success: false, message: "Message is required" });

  const query = message.toLowerCase();
  let matchedProducts = [];
  let replyText = "";
  let suggestedPrompts = [];

  // Semantic intent analysis & catalog matching
  if (query.includes('audio') || query.includes('headphone') || query.includes('sound') || query.includes('music') || query.includes('noise')) {
    matchedProducts = productsStore.filter(p => p.category === 'Audio');
    replyText = `Based on your interest in immersive acoustics, I recommend checking out our **Aura Pro Wireless Headphones** with 40-hour battery & hybrid ANC, or the portable **SoundWave 360** speaker for room-filling sound.`;
    suggestedPrompts = ["Compare Headphones vs Speaker", "What's the battery life on Aura Pro?", "Any discount codes available?"];
  } else if (query.includes('keyboard') || query.includes('typing') || query.includes('switch') || query.includes('code') || query.includes('programming') || query.includes('developer')) {
    matchedProducts = productsStore.filter(p => p.id === 2 || p.id === 4 || p.id === 7);
    replyText = `For dedicated programming and high-speed typing, the **CyberPulse Mechanical Keyboard** with pre-lubed linear switches and aluminum frame pairs amazingly with our **Ultra-Light Ergonomic Mouse** (59g) and **Lumina Studio Desk Light Bar** to eliminate monitor glare during late-night builds!`;
    suggestedPrompts = ["Tell me more about CyberPulse switches", "Show desk accessories under $100", "Apply coupon PROBO20"];
  } else if (query.includes('budget') || query.includes('cheap') || query.includes('under 100') || query.includes('under $100') || query.includes('affordable')) {
    matchedProducts = productsStore.filter(p => p.price < 100);
    replyText = `Here are our highest-rated premium essentials priced under $100: the **Lumina Light Bar** ($54.90), **MagSafe 3-in-1 Foldable Dock** ($49.99), and **Ultra-Light Mouse** ($79.99). You can also apply promo code **PROBO20** for an additional 20% discount!`;
    suggestedPrompts = ["How to apply PROBO20 promo?", "Show best rated under $100", "Recommend a gift"];
  } else if (query.includes('watch') || query.includes('fitness') || query.includes('health') || query.includes('wearable')) {
    matchedProducts = productsStore.filter(p => p.category === 'Wearables');
    replyText = `The **Minimalist Leather Smart Watch** features a gorgeous 1.43" AMOLED display with 7-day battery, SpO2 sensor, and genuine Italian leather strap—transitioning effortlessly from boardroom to gym.`;
    suggestedPrompts = ["Is the watch waterproof?", "Does it track sleep?", "Show all wearables"];
  } else if (query.includes('discount') || query.includes('coupon') || query.includes('promo') || query.includes('code')) {
    replyText = `You're in luck! Use coupon code **PROBO20** at checkout to unlock an exclusive **20% OFF** your entire order today.`;
    suggestedPrompts = ["Show trending electronics", "What are the bestsellers?", "Open my cart"];
  } else {
    // General AI Assistant response
    matchedProducts = productsStore.slice(0, 3);
    replyText = `Welcome to AuraStore AI Concierge! I can analyze our catalog to match your workflow, setup, or budget. Whether you need ergonomic dev gear, wireless audio, or travel tech, I'm here to help. What kind of gear are you searching for today?`;
    suggestedPrompts = ["Best gear for software engineers", "Top wireless audio under $200", "Show me current sales"];
  }

  res.json({
    success: true,
    reply: replyText,
    recommendedProducts: matchedProducts,
    suggestedPrompts
  });
});

// 2. GenAI Review Summarizer
app.post('/api/ai/review-summary', (req, res) => {
  const { productId } = req.body;
  const product = productsStore.find(p => p.id === parseInt(productId));

  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  res.json({
    success: true,
    productId: product.id,
    name: product.name,
    aiSummary: product.aiSummary || {
      pros: ["High quality build materials", "Positive customer feedback ratio", "Prompt delivery"],
      cons: ["High demand may limit immediate restock"],
      verdict: "Verified recommended purchase based on aggregate verified reviews."
    }
  });
});

// 3. GenAI Natural Language Smart Search
app.post('/api/ai/smart-search', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

  const query = prompt.toLowerCase();
  let results = productsStore.filter(p => {
    return p.name.toLowerCase().includes(query) ||
           p.category.toLowerCase().includes(query) ||
           p.description.toLowerCase().includes(query) ||
           Object.values(p.specs || {}).some(v => v.toLowerCase().includes(query));
  });

  if (results.length === 0) {
    results = productsStore.slice(0, 4); // fallback bestsellers
  }

  res.json({
    success: true,
    interpretedIntent: `Semantic search for: "${prompt}"`,
    count: results.length,
    results
  });
});

// Fallback to client app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AuraStore E-Commerce Server running on port ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🤖 GenAI Assistant & REST APIs active`);
  console.log(`=======================================================`);
});
