const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes');
const { app: appConfig, nodeEnv } = require('./config/env');
const errorMiddleware = require('./middlewares/error.middleware');
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', nodeEnv === 'production' ? 1 : false);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (appConfig.corsOrigins.includes('*') || appConfig.corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  if (nodeEnv === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  }
  next();
});
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const authLabDir = path.join(__dirname, '..', 'frontend');
app.use('/auth-lab', express.static(authLabDir));
app.get('/auth-lab', (req, res) => {
  res.sendFile(path.join(authLabDir, 'index.html'));
});

app.use('/api', routes);
app.get('/', (req, res) => res.json({ message: 'Harghar API running' }));
app.use(errorMiddleware);
module.exports = app;
