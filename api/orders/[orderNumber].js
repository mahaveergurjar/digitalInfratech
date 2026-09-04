import { connectDB } from '../_lib/db.js';
import Order from '../_lib/Order.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const order = await Order.findOne({ orderNumber: req.query.orderNumber }).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return res.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch order' });
  }
}
