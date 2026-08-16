const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, index: true },
  sku: { type: String, default: '', trim: true, index: true },
  brand: { type: String, default: '', trim: true },
  pack: { type: String, default: '', trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, default: null, min: 0 },
  badge: { type: String, default: '', trim: true },
  image: { type: String, default: '', trim: true },
  city: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
  unit: { type: String, default: '', trim: true },
  stockQty: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10, min: 0 },
  featured: { type: Boolean, default: false, index: true },
  tags: [{ type: String, trim: true }],
  active: { type: Boolean, default: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
