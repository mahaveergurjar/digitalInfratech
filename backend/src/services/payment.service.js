const Payment = require('../models/payment.model');
const Order = require('../models/order.model');
const { paginateModel } = require('../utils/pagination');

async function populatePayment(payment) {
  return payment.populate([
    { path: 'order', populate: [{ path: 'customer', select: 'name email phone role' }, { path: 'assignedPartner', select: 'name email phone role partner' }] },
    { path: 'customer', select: 'name email phone role partner' },
    { path: 'partner', select: 'name email phone role partner' },
    { path: 'verifiedBy', select: 'name email role' },
    { path: 'rejectedBy', select: 'name email role' }
  ]);
}

module.exports = {
  createForOrder: async (order, context = {}) => {
    const payment = await Payment.findOneAndUpdate(
      { order: order._id },
      {
        $set: {
          customer: order.customer,
          partner: order.assignedPartner || null,
          amount: order.amount,
          expectedAmount: order.amount,
          currency: 'INR',
          method: 'pay_on_site',
          channel: 'partner_collected',
          status: 'pending_verification',
          provider: 'manual',
          collectedByPartner: true
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    order.payment = order.payment || {};
    order.payment.mode = 'pay_on_site';
    order.payment.status = 'pending_verification';
    order.payment.expectedAmount = order.amount;
    order.payment.collectedAmount = order.amount;
    order.payment.currency = 'INR';
    order.payment.collectedByPartner = true;
    order.payment.paymentRecord = payment._id;
    order.payment.verificationNote = context.verificationNote || '';
    await order.save();

    return populatePayment(payment);
  },

  list: async (query = {}) => {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.method) filter.method = query.method;
    if (query.partnerId) filter.partner = query.partnerId;
    if (query.orderId) filter.order = query.orderId;
    if (query.search) {
      const regex = { $regex: query.search, $options: 'i' };
      filter.$or = [
        { providerReferenceId: regex },
        { receiptNumber: regex },
        { rejectionReason: regex },
        { verificationNote: regex }
      ];
    }

    return paginateModel({
      model: Payment,
      filter,
      query,
      sort: { createdAt: -1 },
      populate: [
        'order',
        { path: 'customer', select: 'name email phone role' },
        { path: 'partner', select: 'name email phone role partner' },
        { path: 'verifiedBy', select: 'name email role' },
        { path: 'rejectedBy', select: 'name email role' }
      ]
    });
  },

  verify: async (paymentId, adminUser, data = {}) => {
    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
      throw { status: 404, message: 'Payment not found' };
    }

    payment.method = 'pay_on_site';
    payment.channel = 'partner_collected';
    payment.status = 'verified';
    payment.verifiedAt = new Date();
    payment.verifiedBy = adminUser ? adminUser._id : null;
    payment.rejectedAt = null;
    payment.rejectedBy = null;
    payment.rejectionReason = '';
    payment.verificationNote = String(data.note || '').trim();
    payment.collectedByPartner = true;
    payment.collectedAt = payment.collectedAt || payment.verifiedAt;
    await payment.save();

    const order = await Order.findById(payment.order._id);
    if (order) {
      order.payment = order.payment || {};
      order.payment.mode = payment.method;
      order.payment.status = 'verified';
      order.payment.expectedAmount = payment.expectedAmount;
      order.payment.collectedAmount = payment.amount;
      order.payment.currency = payment.currency;
      order.payment.collectedByPartner = payment.collectedByPartner;
      order.payment.paymentRecord = payment._id;
      order.payment.verificationNote = payment.verificationNote;
      order.payment.verifiedAt = payment.verifiedAt;
      order.payment.verifiedBy = payment.verifiedBy;
      order.status = order.status === 'pending' ? 'confirmed' : order.status;
      order.statusUpdatedAt = new Date();
      await order.save();
    }

    return populatePayment(payment);
  },

  reject: async (paymentId, adminUser, data = {}) => {
    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) {
      throw { status: 404, message: 'Payment not found' };
    }

    payment.method = 'pay_on_site';
    payment.channel = 'partner_collected';
    payment.status = 'rejected';
    payment.rejectedAt = new Date();
    payment.rejectedBy = adminUser ? adminUser._id : null;
    payment.rejectionReason = String(data.reason || '').trim() || 'Payment rejected by admin';
    payment.verificationNote = String(data.note || '').trim();
    payment.collectedByPartner = true;
    await payment.save();

    const order = await Order.findById(payment.order._id);
    if (order) {
      order.payment = order.payment || {};
      order.payment.status = 'rejected';
      order.payment.rejectionReason = payment.rejectionReason;
      order.payment.rejectedAt = payment.rejectedAt;
      order.payment.rejectedBy = payment.rejectedBy;
      order.payment.paymentRecord = payment._id;
      order.payment.verificationNote = payment.verificationNote;
      order.status = 'on_hold';
      order.statusUpdatedAt = new Date();
      await order.save();
    }

    return populatePayment(payment);
  }
};
