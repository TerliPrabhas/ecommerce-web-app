# AuraStore | Full-Stack E-Commerce Web Application with GenAI Shopping Concierge

> **Developed by:** Terli Jogiswara Prabhas  
> **Institution:** National Institute of Technology, Agartala (CSE, CGPA: 8.23)  
> **Contact:** [prabhasterli@gmail.com](mailto:prabhasterli@gmail.com) | +91-8074811487  
> **Profiles:** [GitHub](https://github.com/TerliPrabhas) | [LinkedIn](https://www.linkedin.com/in/prabhasterli1899/)


> **Permanent Live Deployment:** [https://ecommerce-web-app-rya0.onrender.com](https://ecommerce-web-app-rya0.onrender.com)  
> [![Live Demo](https://img.shields.io/badge/Live_Demo-AuraStore-00C853?style=for-the-badge&logo=render&logoColor=white)](https://ecommerce-web-app-rya0.onrender.com)
> [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TerliPrabhas/ecommerce-web-app)

---

## 🌟 Executive Overview
**AuraStore** is a production-grade full-stack e-commerce web platform engineered with **HTML5, CSS3, Modern JavaScript/React-like reactive UI, Node.js, Express.js, MongoDB, and integrated Generative AI**. 

It features an intelligent **Aura AI Shopping Concierge**, real-time product search with semantic intent matching, quick-view modals with AI review synthesis, an interactive cart slide-over drawer, coupon discount verification (`PROBO20` for 20% OFF), and complete multi-step checkout with order receipt generation.

---

## 🚀 Key Features

### 1. Modern Glassmorphic Frontend & UI/UX
- **Responsive Layout**: Adapts smoothly across mobile, tablet, and ultra-wide displays.
- **Dark & Light Mode**: Instant client-side theme switching with persistent CSS variables.
- **Dynamic Category Filtering**: Electronics, Audio, Wearables, Accessories, and Smart Office.
- **Instant Search & Multi-Criteria Sorting**: Sort by price (low/high), customer rating, or name.

### 2. Full Shopping Cart & Checkout System
- **Interactive Cart Slide-over**: Real-time quantity increment/decrement, item deletion, and badge counts.
- **Promo Code Engine**: Server-side coupon verification (`PROBO20`) calculating automated 20% subtotal discounts and 8% tax.
- **Multi-step Checkout Modal**: Customer shipping address validation, payment method selector (Credit Card, UPI/GPay, COD), and instantaneous simulated order placement.
- **Order Confirmation & Receipts**: Generates unique `ORD-XXXXXX` references with complete itemized receipt breakdown.

### 3. Generative AI Capabilities
- **Aura AI Shopping Concierge**: Conversational assistant embedded in a sliding drawer that understands user preferences (e.g. "Suggest noise-canceling gear for coding at night").
- **Interactive Product Ingestion**: Returns clickable product recommendation cards directly inside the AI conversation stream with one-click "Add to Cart".
- **AI Review Synthesis & Sentiment Breakdown**: Analyzes simulated verified buyer feedback to generate key pros, cons, and an overall purchase verdict for every product.
- **Semantic Smart Search**: Converts natural language phrases into structured catalog queries.

### 4. Robust Full-Stack Backend & Database
- **Express.js REST APIs**:
  - `GET /api/products` - Filtered & sorted product listings
  - `GET /api/products/:id` - Detailed product information
  - `GET /api/categories` - Dynamic categories list
  - `GET /api/cart` & `POST /api/cart` - Cart state synchronization
  - `DELETE /api/cart/:id` - Cart item removal
  - `POST /api/checkout` - Order processing & discount logic
  - `POST /api/ai/chat` - GenAI Shopping Assistant endpoint
  - `POST /api/ai/review-summary` - AI review generation
  - `POST /api/ai/smart-search` - Natural language query interpreter
- **Dual-Mode MongoDB / In-Memory Store**: Works seamlessly out of the box with an in-memory database or connects to remote MongoDB Atlas via `MONGODB_URI`.

---

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3 (Custom Glassmorphism, CSS Variables, Flexbox/Grid), Modern ES6+ JavaScript, FontAwesome 6, Google Fonts
- **Backend**: Node.js, Express.js, CORS, Dotenv, Helmet
- **Database**: MongoDB (Mongoose models: Product, Order) + In-memory fallback
- **GenAI**: Aura AI Conversational Shopping Concierge Engine

---

## ⚡ Quick Start & Running Locally

1. **Navigate to project directory**:
   ```bash
   cd "C:\Users\prabh\OneDrive\Desktop\1)E-Commerce Website"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch Server**:
   ```bash
   node server.js
   ```

4. **Open in Browser**:
   Visit [http://localhost:3001](http://localhost:3001)

---

## ☁️ Deployment Instructions

### Vercel Deployment (One-Click)
1. Run `npx vercel` inside this folder.
2. The bundled `vercel.json` will automatically configure the Express API and frontend static assets.

### Render Deployment
1. Connect this repository to [Render.com](https://render.com).
2. Select **Web Service**; `render.yaml` handles build and start commands automatically.
