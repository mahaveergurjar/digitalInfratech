import { signAdminToken } from '../_lib/jwt.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@digitalinfratech.in';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!email?.trim() || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email.trim().toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const token = signAdminToken({ email: adminEmail, role: 'admin', name: 'Admin' });

  return res.json({
    success: true,
    token,
    admin: { email: adminEmail, name: 'Admin', role: 'admin' },
  });
}
