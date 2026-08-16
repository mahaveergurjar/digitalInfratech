const mongoose = require('mongoose');
const RateLimitBucket = require('../models/rateLimitBucket.model');

const buckets = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

function usingMongoStore() {
  return mongoose.connection.readyState === 1;
}

function getBucketKey(req, key) {
  return `${req.baseUrl || ''}${req.path}:${key}`;
}

function handleMemoryLimit({ windowMs, max, keyGenerator, message }) {
  return (req, res, next) => {
    const key = keyGenerator ? keyGenerator(req) : req.ip;
    const now = Date.now();
    const bucketKey = getBucketKey(req, key);
    let bucket = buckets.get(bucketKey);

    if (!bucket || bucket.resetAt <= now) {
      bucket = {
        count: 0,
        resetAt: now + windowMs
      };
    }

    bucket.count += 1;
    buckets.set(bucketKey, bucket);

    if (bucket.count > max) {
      const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.set('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        error: message || 'Too many requests, please try again later.'
      });
    }

    return next();
  };
}

async function incrementMongoBucket(bucketKey, windowMs, now) {
  const existing = await RateLimitBucket.findOneAndUpdate(
    { key: bucketKey, resetAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true }
  );

  if (existing) {
    return existing;
  }

  const resetAt = new Date(now.getTime() + windowMs);

  try {
    return await RateLimitBucket.findOneAndUpdate(
      { key: bucketKey },
      { $set: { count: 1, resetAt } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    if (err && err.code === 11000) {
      return RateLimitBucket.findOneAndUpdate(
        { key: bucketKey, resetAt: { $gt: now } },
        { $inc: { count: 1 } },
        { new: true }
      );
    }

    throw err;
  }
}

function handleMongoLimit({ windowMs, max, keyGenerator, message }) {
  return async (req, res, next) => {
    try {
      const key = keyGenerator ? keyGenerator(req) : req.ip;
      const now = new Date();
      const bucketKey = getBucketKey(req, key);
      const bucket = await incrementMongoBucket(bucketKey, windowMs, now);

      if (bucket.count > max) {
        const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt.getTime() - now.getTime()) / 1000));
        res.set('Retry-After', String(retryAfterSeconds));
        return res.status(429).json({
          success: false,
          error: message || 'Too many requests, please try again later.'
        });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
}

function createRateLimit({ windowMs, max, keyGenerator, message }) {
  if (usingMongoStore()) {
    return handleMongoLimit({ windowMs, max, keyGenerator, message });
  }

  return handleMemoryLimit({ windowMs, max, keyGenerator, message });
}

module.exports = createRateLimit;
