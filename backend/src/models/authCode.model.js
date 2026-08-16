const mongoose = require('mongoose');

const authCodeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['email_verification', 'login_2fa', 'password_reset'],
    required: true,
    index: true
  },
  tokenHash: { type: String, default: null, index: true },
  codeHash: { type: String, default: null },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  consumedAt: { type: Date, default: null },
  attempts: { type: Number, default: 0 },
  metadata: {
    email: { type: String, default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model('AuthCode', authCodeSchema);
