const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  itemType: { type: String, enum: ['product', 'service'], required: true, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', default: null },
  itemSnapshot: {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' }
  },
  payment: {
    mode: {
      type: String,
      enum: ['pay_on_site', 'gateway'],
      default: 'pay_on_site',
      index: true
    },
    status: {
      type: String,
      enum: ['pending_verification', 'verified', 'rejected', 'refunded'],
      default: 'pending_verification',
      index: true
    },
    expectedAmount: { type: Number, default: 0, min: 0 },
    collectedAmount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'INR', trim: true },
    collectedByPartner: { type: Boolean, default: true },
    paymentRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    verificationNote: { type: String, default: '', trim: true },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    rejectedAt: { type: Date, default: null },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  quantity: { type: Number, default: 1, min: 1 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in_progress', 'fulfilled', 'completed', 'cancelled', 'on_hold'],
    default: 'pending',
    index: true
  },
  partnerStatus: {
    type: String,
    enum: ['unassigned', 'assigned', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled'],
    default: 'unassigned',
    index: true
  },
  assignedPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  allocation: { type: mongoose.Schema.Types.ObjectId, ref: 'JobAllocation', default: null },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal', index: true },
  assignmentNote: { type: String, default: '', trim: true },
  dispatchNotes: { type: String, default: '', trim: true },
  acceptedAt: { type: Date, default: null },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  statusUpdatedAt: { type: Date, default: null },
  scheduledAt: { type: Date, default: null },
  notes: { type: String, default: '', trim: true },
  contactName: { type: String, required: true, trim: true },
  contactEmail: { type: String, required: true, trim: true, lowercase: true },
  contactPhone: { type: String, default: '', trim: true },
  address: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
