const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR', trim: true },
  method: {
    type: String,
    enum: ['pay_on_site', 'gateway'],
    default: 'pay_on_site',
    index: true
  },
  channel: {
    type: String,
    enum: ['partner_collected', 'online', 'admin_adjustment'],
    default: 'partner_collected',
    index: true
  },
  status: {
    type: String,
    enum: ['pending_verification', 'verified', 'rejected', 'refunded'],
    default: 'pending_verification',
    index: true
  },
  provider: { type: String, default: 'manual', trim: true },
  providerReferenceId: { type: String, default: '', trim: true },
  receiptNumber: { type: String, default: '', trim: true },
  collectedByPartner: { type: Boolean, default: true },
  collectedAt: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  rejectedAt: { type: Date, default: null },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  rejectionReason: { type: String, default: '', trim: true },
  verificationNote: { type: String, default: '', trim: true },
  expectedAmount: { type: Number, default: 0, min: 0 },
  metadata: {
    gatewayProvider: { type: String, default: '', trim: true },
    gatewayTransactionId: { type: String, default: '', trim: true },
    gatewayPayload: { type: mongoose.Schema.Types.Mixed, default: null },
    proofUrl: { type: String, default: '', trim: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
