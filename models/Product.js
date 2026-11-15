const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 10 },
  badge: { type: String },
  image: { type: String, required: true },
  description: { type: String, required: true },
  specs: { type: Map, of: String },
  aiSummary: {
    pros: [String],
    cons: [String],
    verdict: String
  }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
