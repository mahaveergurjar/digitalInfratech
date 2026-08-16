const jwt = require('jsonwebtoken');
const { auth } = require('../config/env');
const User = require('../models/user.model');
const Session = require('../models/session.model');

module.exports = async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const payload = jwt.verify(token, auth.accessTokenSecret);
    if (payload.type !== 'access' || !payload.sub || !payload.sid) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    const [user, session] = await Promise.all([
      User.findById(payload.sub),
      Session.findById(payload.sid)
    ]);

    if (
      !user
      || !session
      || session.revokedAt
      || session.expiresAt <= new Date()
      || String(session.user) !== String(user._id)
      || Number(payload.ver || 0) !== Number(user.authVersion || 0)
      || user.status !== 'active'
      || !user.emailVerified
    ) {
      return res.status(401).json({ success: false, error: 'Invalid session' });
    }

    req.auth = payload;
    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    return next(err);
  }
};
