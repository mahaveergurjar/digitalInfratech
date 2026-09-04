import { verifyAdminToken } from './jwt.js';

export function requireAdmin(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    const error = new Error('Admin login required');
    error.status = 401;
    throw error;
  }

  try {
    const decoded = verifyAdminToken(token);
    if (decoded.role !== 'admin') {
      const error = new Error('Admin access only');
      error.status = 403;
      throw error;
    }
    return decoded;
  } catch (authError) {
    if (authError.status) {
      throw authError;
    }
    const error = new Error('Session expired. Please login again.');
    error.status = 401;
    throw error;
  }
}
