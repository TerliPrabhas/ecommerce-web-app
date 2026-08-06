# 🛒 AuraStore — Full-Stack E-Commerce Web Application

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express](https://img.shields.io/badge/Express-v4.19-blue.svg)
![License](https://img.shields.io/badge/License-MIT-purple.svg)

A modern, high-performance, full-stack E-Commerce Web Application built with **Node.js**, **Express.js**, **HTML5**, **Vanilla CSS3**, and **JavaScript (ES6+)**. Featured with dynamic product catalog search, real-time filtering, modal quick-views, interactive shopping cart drawer, promo code discounts, order checkout processing, and dark/light theme switching.

---

## 🌟 Key Features

- **Product Catalog Management**: Dynamic grid display with rating badges, stock status, and category tags.
- **Search & Advanced Filtering**: Filter products by category, price range, rating, and instant keyword searching.
- **Quick View Modal**: Interactive product modal displaying technical specifications, reviews, and high-res imagery.
- **Interactive Shopping Cart Drawer**: Real-time quantity adjustment, item removal, and subtotal/tax calculations.
- **Promo Code & Discount Flow**: Apply promotional discount codes (e.g. `PROBO20`) with instant recalculation.
- **Order Checkout API**: Backend `/api/checkout` endpoint generating unique order IDs (`ORD-XXXXXX`) and order summaries.
- **Dark / Light Glassmorphism UI**: Premium dark mode theme with glassmorphic cards, smooth micro-interactions, and toast alerts.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design Tokens & Glassmorphic UI), Modern JavaScript (Fetch API, DOM manipulation).
- **Backend**: Node.js, Express.js REST API server.
- **Data Store**: In-Memory data store fallback / MongoDB compatible schema.

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieve all products (Supports `category`, `search`, `sortBy` query params) |
| `GET` | `/api/products/:id` | Get detailed product by ID |
| `GET` | `/api/categories` | Retrieve product categories list |
| `GET` | `/api/cart` | Get current shopping cart state |
| `POST` | `/api/cart` | Add or update quantity of item in cart |
| `DELETE` | `/api/cart/:id` | Remove item from cart |
| `POST` | `/api/checkout` | Submit order checkout & calculate discounts/tax |

---

## ⚡ Quick Start & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TerliPrabhas/ecommerce-web-app.git
   cd ecommerce-web-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Express server**:
   ```bash
   npm start
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3001` in your browser.

---

## 🧑‍💻 Author

Developed by **Terli Jogiswara Prabhas**  
- **GitHub**: [@TerliPrabhas](https://github.com/TerliPrabhas)  
- **LinkedIn**: [TerliPrabhas](https://linkedin.com/in/TerliPrabhas)  
- **Email**: [prabhasterli@gmail.com](mailto:prabhasterli@gmail.com)
