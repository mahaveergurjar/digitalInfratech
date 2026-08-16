const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  revokedAt: { type: Date, default: null, index: true },
  lastUsedAt: { type: Date, default: Date.now },
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
