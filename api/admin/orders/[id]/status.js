import { connectDB } from '../../../_lib/db.js';
import Order from '../../../_lib/Order.js';
import { requireAdmin } from '../../../_lib/adminAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    requireAdmin(req);
    await connectDB();

    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    const { status } = req.body || {};

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(req.query.id, { status }, { new: true }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({ success: true, order });
  } catch (error) {
    const status = error.status || 500;
    if (status === 500) {
      console.error('Admin order status error:', error);
    }
    return res.status(status).json({
      success: false,
      message: error.message || 'Could not update order',
    });
  }
}
