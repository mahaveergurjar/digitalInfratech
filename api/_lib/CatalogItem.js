import mongoose from 'mongoose';

const catalogItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['product', 'service'], required: true },
    name: { type: String, required: true, trim: true },
    summary: { type: String, default: '', trim: true },
    pack: { type: String, default: '', trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
    emoji: { type: String, default: '🛠️' },
    active: { type: Boolean, default: true, index: true },
    createdAt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.CatalogItem || mongoose.model('CatalogItem', catalogItemSchema);
