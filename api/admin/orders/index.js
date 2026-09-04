import { connectDB } from '../../_lib/db.js';
import Order from '../../_lib/Order.js';
import { requireAdmin } from '../../_lib/adminAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    requireAdmin(req);
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders });
  } catch (error) {
    const status = error.status || 500;
    if (status === 500) {
      console.error('Admin orders list error:', error);
    }
    return res.status(status).json({
      success: false,
      message: error.message || 'Could not load orders',
    });
  }
}
