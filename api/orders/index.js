import { connectDB } from '../_lib/db.js';
import Order from '../_lib/Order.js';
import { createOrderNumber, validateOrderBody } from '../_lib/orders.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const errors = validateOrderBody(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }

    await connectDB();

    const items = req.body.items.map((item) => ({
      itemId: String(item.itemId || item.id),
      type: item.type === 'service' ? 'service' : 'product',
      name: String(item.name).trim(),
      pack: String(item.pack || '').trim(),
      price: Number(item.price),
      qty: Number(item.qty) || 1,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = Math.round(subtotal * 0.15);
    const total = subtotal - discount;

    const order = await Order.create({
      orderNumber: createOrderNumber(),
      customer: {
        name: req.body.customer.name.trim(),
        email: req.body.customer.email.trim().toLowerCase(),
        phone: req.body.customer.phone.trim(),
      },
      address: req.body.address.trim(),
      city: (req.body.city || 'Lucknow').trim(),
      note: (req.body.note || '').trim(),
      items,
      subtotal,
      discount,
      total,
      paymentMode: 'pay_on_delivery',
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Order create error:', error);
    return res.status(500).json({ success: false, message: 'Could not place order. Please try again.' });
  }
}
