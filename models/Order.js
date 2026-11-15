const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [{
    productId: Number,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingAddress: {
    fullName: String,
    email: String,
    address: String,
    city: String,
    zipCode: String
  },
  paymentMethod: { type: String, default: 'Credit Card / Online' },
  summary: {
    subtotal: Number,
    discount: Number,
    tax: Number,
    finalTotal: Number,
    promoCode: String
  },
  status: { type: String, default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
