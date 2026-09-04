import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    type: { type: String, enum: ['product', 'service'], required: true },
    name: { type: String, required: true },
    pack: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
    },
    address: { type: String, required: true, trim: true },
    city: { type: String, default: 'Lucknow', trim: true },
    note: { type: String, default: '', trim: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(value) => value.length > 0, 'Cart cannot be empty'],
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMode: { type: String, enum: ['pay_on_delivery'], default: 'pay_on_delivery' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
