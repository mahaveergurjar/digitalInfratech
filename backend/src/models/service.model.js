const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, default: '', trim: true, index: true },
  category: { type: String, required: true, trim: true, index: true },
  subCategory: { type: String, default: '', trim: true },
  description: { type: String, default: '', trim: true },
  price: { type: Number, default: 0, min: 0 },
  image: { type: String, default: '', trim: true },
  durationMinutes: { type: Number, default: 60, min: 0 },
  active: { type: Boolean, default: true, index: true },
  partnerTags: [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
