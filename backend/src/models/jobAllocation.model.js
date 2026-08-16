const mongoose = require('mongoose');

const jobAllocationSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: {
    type: String,
    enum: ['assigned', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled'],
    default: 'assigned',
    index: true
  },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal', index: true },
  notes: { type: String, default: '', trim: true },
  adminNotes: { type: String, default: '', trim: true },
  scheduledFor: { type: Date, default: null },
  acceptedAt: { type: Date, default: null },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  estimatedMinutes: { type: Number, default: 0, min: 0 },
  actualMinutes: { type: Number, default: 0, min: 0 },
  efficiencyScore: { type: Number, default: 0, min: 0, max: 100 },
  qualityScore: { type: Number, default: 0, min: 0, max: 100 },
  responseScore: { type: Number, default: 0, min: 0, max: 100 },
  createdFrom: { type: String, enum: ['order', 'manual'], default: 'order' }
}, { timestamps: true });

module.exports = mongoose.model('JobAllocation', jobAllocationSchema);
