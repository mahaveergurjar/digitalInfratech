const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Service = require('../models/service.model');
const paymentService = require('./payment.service');
const { paginateModel } = require('../utils/pagination');

async function resolveProduct(productId, quantity = 1) {
  const product = await Product.findById(productId);
  if (!product || !product.active) {
    throw { status: 404, message: 'Product not found' };
  }

  return {
    product: product._id,
    service: null,
    snapshot: {
      name: product.name,
      price: product.price,
      image: product.image || ''
    },
    quantity: quantity || 1,
    amount: product.price * (quantity || 1)
  };
}

async function resolveItem(data) {
  if (data.itemType === 'product') {
    const product = await Product.findById(data.productId);
    if (!product || !product.active) {
      throw { status: 404, message: 'Product not found' };
    }

    return {
      product: product._id,
      service: null,
      snapshot: {
        name: product.name,
        price: product.price,
        image: product.image || ''
      },
      quantity: data.quantity || 1,
      amount: product.price * (data.quantity || 1)
    };
  }

  if (data.itemType === 'service') {
    const service = await Service.findById(data.serviceId);
    if (!service) {
      throw { status: 404, message: 'Service not found' };
    }

    return {
      product: null,
      service: service._id,
      snapshot: {
        name: service.name,
        price: service.price || 0,
        image: service.image || ''
      },
      quantity: 1,
      amount: service.price || 0
    };
  }

  throw { status: 400, message: 'Invalid order item type' };
}

module.exports = {
  createPublic: async (data) => {
    // Simple public order - no authentication needed
    const resolved = await resolveProduct(data.productId, data.quantity);

    const order = await Order.create({
      itemType: 'product',
      product: resolved.product,
      service: null,
      itemSnapshot: resolved.snapshot,
      quantity: resolved.quantity,
      notes: data.notes || '',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      address: data.address,
      amount: resolved.amount,
      status: 'pending',
      partnerStatus: 'unassigned'
    });

    return Order.findById(order._id);
  },
  create: async (user, data) => {
    const resolved = await resolveItem(data);

    const order = await Order.create({
      customer: user._id,
      itemType: data.itemType,
      product: resolved.product,
      service: resolved.service,
      itemSnapshot: resolved.snapshot,
      quantity: resolved.quantity,
      scheduledAt: data.scheduledAt || null,
      notes: data.notes || '',
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || '',
      address: data.address,
      amount: resolved.amount
    });

    await paymentService.createForOrder(order);
    return Order.findById(order._id)
      .populate('assignedPartner', 'name email role partner')
      .populate('allocation')
      .populate('payment.paymentRecord');
  },
  listMine: async (user, query = {}) => paginateModel({
    model: Order,
    filter: { customer: user._id },
    query,
    sort: { createdAt: -1 },
    populate: [
      { path: 'assignedPartner', select: 'name email role partner' },
      'allocation',
      'payment.paymentRecord'
    ]
  }),
  listAll: async (query = {}) => paginateModel({
    model: Order,
    query,
    sort: { createdAt: -1 },
    populate: [
      { path: 'customer', select: 'name email role' },
      { path: 'assignedPartner', select: 'name email role partner' },
      'allocation',
      'payment.paymentRecord'
    ]
  }),
  getById: async (user, id) => {
    const order = await Order.findById(id)
      .populate('customer', 'name email role')
      .populate('assignedPartner', 'name email role partner')
      .populate('allocation')
      .populate('payment.paymentRecord');
    if (!order) throw { status: 404, message: 'Order not found' };
    if (user.role !== 'admin' && String(order.customer._id) !== String(user._id)) {
      throw { status: 403, message: 'Insufficient permissions' };
    }
    return order;
  },
  updateStatus: async (id, status) => {
    const order = await Order.findByIdAndUpdate(id, { status, statusUpdatedAt: new Date() }, { new: true, runValidators: true });
    if (!order) throw { status: 404, message: 'Order not found' };
    return order;
  }
};
