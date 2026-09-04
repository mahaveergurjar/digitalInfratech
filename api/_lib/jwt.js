import jwt from 'jsonwebtoken';

export function signAdminToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev-admin-secret-change-me';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyAdminToken(token) {
  const secret = process.env.JWT_SECRET || 'dev-admin-secret-change-me';
  return jwt.verify(token, secret);
}
