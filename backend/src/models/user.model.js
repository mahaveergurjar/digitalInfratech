const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, default: '', trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'partner', 'admin'], default: 'customer' },
  status: { type: String, enum: ['pending_verification', 'active', 'suspended'], default: 'pending_verification' },
  emailVerified: { type: Boolean, default: false, index: true },
  emailVerifiedAt: { type: Date, default: null },
  lastLoginAt: { type: Date, default: null },
  authVersion: { type: Number, default: 0, min: 0 },
  partner: {
    applicationStatus: {
      type: String,
      enum: ['not_applied', 'pending_review', 'approved', 'rejected', 'suspended'],
      default: 'not_applied',
      index: true
    },
    companyName: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    serviceCategories: [{ type: String, trim: true }],
    serviceAreas: [{ type: String, trim: true }],
    bio: { type: String, default: '', trim: true },
    experienceYears: { type: Number, default: 0, min: 0 },
    maxConcurrentJobs: { type: Number, default: 3, min: 1 },
    applicationNote: { type: String, default: '', trim: true },
    rejectionReason: { type: String, default: '', trim: true },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    suspendedAt: { type: Date, default: null },
    lastAssignmentAt: { type: Date, default: null },
    lastCompletionAt: { type: Date, default: null },
    activeJobs: { type: Number, default: 0, min: 0 },
    completedJobs: { type: Number, default: 0, min: 0 },
    cancelledJobs: { type: Number, default: 0, min: 0 },
    onTimeRate: { type: Number, default: 0, min: 0, max: 100 },
    efficiencyScore: { type: Number, default: 0, min: 0, max: 100 },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
