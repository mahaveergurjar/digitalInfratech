const mongoose = require('mongoose');

const rateLimitBucketSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  count: { type: Number, default: 0, min: 0 },
  resetAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true });

module.exports = mongoose.model('RateLimitBucket', rateLimitBucketSchema);
