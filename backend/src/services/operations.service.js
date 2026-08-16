const User = require('../models/user.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Service = require('../models/service.model');
const JobAllocation = require('../models/jobAllocation.model');
const { paginateModel } = require('../utils/pagination');
const { buildSearchRegex } = require('../utils/search');

function normalizeTextList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function partnerStatusToOrderStatus(status, orderType) {
  switch (status) {
    case 'assigned':
      return 'assigned';
    case 'accepted':
      return 'confirmed';
    case 'in_progress':
      return 'in_progress';
    case 'completed':
      return orderType === 'product' ? 'fulfilled' : 'completed';
    case 'cancelled':
    case 'rejected':
      return 'cancelled';
    default:
      return 'pending';
  }
}

async function refreshPartnerMetrics(partnerId) {
  const partner = await User.findById(partnerId);
  if (!partner || partner.role !== 'partner') {
    return null;
  }
  partner.partner = partner.partner || {};

  const [activeJobs, completedJobs, cancelledJobs, completedOnTime, completedWithSchedule] = await Promise.all([
    JobAllocation.countDocuments({
      partner: partner._id,
      status: { $in: ['assigned', 'accepted', 'in_progress'] }
    }),
    JobAllocation.countDocuments({
      partner: partner._id,
      status: 'completed'
    }),
    JobAllocation.countDocuments({
      partner: partner._id,
      status: { $in: ['cancelled', 'rejected'] }
    }),
    JobAllocation.countDocuments({
      partner: partner._id,
      status: 'completed',
      scheduledFor: { $ne: null },
      $expr: { $lte: ['$completedAt', '$scheduledFor'] }
    }),
    JobAllocation.countDocuments({
      partner: partner._id,
      status: 'completed',
      scheduledFor: { $ne: null }
    })
  ]);

  const completedTotal = completedJobs || 0;
  const efficiencyBase = activeJobs + completedJobs + cancelledJobs;
  const efficiencyScore = efficiencyBase > 0
    ? Math.round((completedJobs / efficiencyBase) * 100)
    : 0;
  const onTimeRate = completedWithSchedule > 0
    ? Math.round((completedOnTime / completedWithSchedule) * 100)
    : partner.partner.onTimeRate || 0;

  partner.partner.activeJobs = activeJobs;
  partner.partner.completedJobs = completedTotal;
  partner.partner.cancelledJobs = cancelledJobs;
  partner.partner.onTimeRate = onTimeRate;
  partner.partner.efficiencyScore = efficiencyScore;
  await partner.save();

  return partner;
}

async function getPartnerLean(partner) {
  if (!partner) return null;
  if (typeof partner.toObject === 'function') {
    partner = partner.toObject();
  }
  return {
    id: partner._id,
    name: partner.name,
    email: partner.email,
    phone: partner.phone || '',
    role: partner.role,
    status: partner.status,
    partner: partner.partner || null
  };
}

async function createAllocation(order, partner, adminUser, payload = {}) {
  partner.partner = partner.partner || {};
  const allocation = await JobAllocation.create({
    order: order._id,
    partner: partner._id,
    assignedBy: adminUser ? adminUser._id : null,
    status: payload.status || 'assigned',
    priority: payload.priority || 'normal',
    notes: payload.notes || '',
    adminNotes: payload.adminNotes || '',
    scheduledFor: payload.scheduledFor || order.scheduledAt || null,
    estimatedMinutes: Number.isFinite(Number(payload.estimatedMinutes)) ? Number(payload.estimatedMinutes) : 0,
    createdFrom: 'order'
  });

  order.assignedPartner = partner._id;
  order.assignedBy = adminUser ? adminUser._id : null;
  order.allocation = allocation._id;
  order.partnerStatus = allocation.status;
  order.priority = allocation.priority;
  order.assignmentNote = payload.notes || '';
  order.dispatchNotes = payload.adminNotes || '';
  order.acceptedAt = allocation.status === 'accepted' ? new Date() : order.acceptedAt;
  order.startedAt = allocation.status === 'in_progress' ? new Date() : order.startedAt;
  order.completedAt = allocation.status === 'completed' ? new Date() : order.completedAt;
  order.status = partnerStatusToOrderStatus(allocation.status, order.itemType);
  order.statusUpdatedAt = new Date();
  await order.save();

  partner.partner.lastAssignmentAt = new Date();
  await partner.save();

  await refreshPartnerMetrics(partner._id);

  return allocation.populate([
    { path: 'order', populate: [{ path: 'customer', select: 'name email role phone' }, { path: 'assignedPartner', select: 'name email role partner' }] },
    { path: 'partner', select: 'name email role phone partner' },
    { path: 'assignedBy', select: 'name email role' }
  ]);
}

function applyAllocationUpdateFields(allocation, status, payload = {}) {
  allocation.status = status;
  if (payload.notes !== undefined) allocation.notes = payload.notes;
  if (payload.adminNotes !== undefined) allocation.adminNotes = payload.adminNotes;
  if (payload.priority) allocation.priority = payload.priority;
  if (payload.scheduledFor !== undefined) allocation.scheduledFor = payload.scheduledFor || null;
  if (payload.estimatedMinutes !== undefined) {
    allocation.estimatedMinutes = Number.isFinite(Number(payload.estimatedMinutes)) ? Number(payload.estimatedMinutes) : allocation.estimatedMinutes;
  }

  const now = new Date();
  if (status === 'accepted') allocation.acceptedAt = allocation.acceptedAt || now;
  if (status === 'in_progress') allocation.startedAt = allocation.startedAt || now;
  if (status === 'completed') allocation.completedAt = allocation.completedAt || now;
  return now;
}

async function updateAllocationAndOrder(allocation, status, payload = {}) {
  const now = applyAllocationUpdateFields(allocation, status, payload);

  await allocation.save();

  const order = await Order.findById(allocation.order);
  if (order) {
    order.assignedPartner = allocation.partner;
    order.allocation = allocation._id;
    order.partnerStatus = status;
    order.priority = allocation.priority;
    order.assignmentNote = allocation.notes;
    order.dispatchNotes = allocation.adminNotes;
    order.acceptedAt = allocation.acceptedAt || order.acceptedAt;
    order.startedAt = allocation.startedAt || order.startedAt;
    order.completedAt = allocation.completedAt || order.completedAt;
    order.status = partnerStatusToOrderStatus(status, order.itemType);
    order.statusUpdatedAt = now;
    await order.save();
  }

  const partner = await User.findById(allocation.partner);
  if (partner && partner.role === 'partner') {
    partner.partner = partner.partner || {};
    partner.partner.activeJobs = await JobAllocation.countDocuments({
      partner: partner._id,
      status: { $in: ['assigned', 'accepted', 'in_progress'] }
    });
    if (status === 'completed') {
      partner.partner.lastCompletionAt = now;
    }
    await partner.save();
    await refreshPartnerMetrics(partner._id);
  }

  return allocation.populate([
    { path: 'order', populate: [{ path: 'customer', select: 'name email role phone' }, { path: 'assignedPartner', select: 'name email role partner' }] },
    { path: 'partner', select: 'name email role phone partner' },
    { path: 'assignedBy', select: 'name email role' }
  ]);
}

async function updateAllocationOnly(allocation, status, payload = {}) {
  const now = applyAllocationUpdateFields(allocation, status, payload);

  await allocation.save();

  const partner = await User.findById(allocation.partner);
  if (partner && partner.role === 'partner') {
    partner.partner = partner.partner || {};
    partner.partner.activeJobs = await JobAllocation.countDocuments({
      partner: partner._id,
      status: { $in: ['assigned', 'accepted', 'in_progress'] }
    });
    if (status === 'completed') {
      partner.partner.lastCompletionAt = now;
    }
    await partner.save();
    await refreshPartnerMetrics(partner._id);
  }

  return allocation.populate([
    { path: 'order', populate: [{ path: 'customer', select: 'name email role phone' }, { path: 'assignedPartner', select: 'name email role partner' }] },
    { path: 'partner', select: 'name email role phone partner' },
    { path: 'assignedBy', select: 'name email role' }
  ]);
}

module.exports = {
  overview: async () => {
    const [
      totalOrders,
      productOrders,
      serviceOrders,
      pendingOrders,
      assignedOrders,
      inProgressOrders,
      completedOrders,
      cancelledOrders,
      totalProducts,
      activeProducts,
      totalServices,
      activeServices,
      totalPartners,
      pendingApplications,
      approvedPartners,
      activeAllocations,
      recentOrders,
      topPartners
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ itemType: 'product' }),
      Order.countDocuments({ itemType: 'service' }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ partnerStatus: 'assigned' }),
      Order.countDocuments({ partnerStatus: 'in_progress' }),
      Order.countDocuments({ status: { $in: ['fulfilled', 'completed'] } }),
      Order.countDocuments({ status: 'cancelled' }),
      Product.countDocuments(),
      Product.countDocuments({ active: true }),
      Service.countDocuments(),
      Service.countDocuments({ active: true }),
      User.countDocuments({ role: 'partner' }),
      User.countDocuments({ role: 'partner', 'partner.applicationStatus': 'pending_review' }),
      User.countDocuments({ role: 'partner', 'partner.applicationStatus': { $in: ['approved', 'active'] } }),
      JobAllocation.countDocuments({ status: { $in: ['assigned', 'accepted', 'in_progress'] } }),
      Order.find().sort({ createdAt: -1 }).limit(8).populate('customer', 'name email role').populate('assignedPartner', 'name email role partner'),
      User.find({ role: 'partner' })
        .sort({ 'partner.efficiencyScore': -1, 'partner.completedJobs': -1, 'partner.ratingAverage': -1 })
        .limit(5)
        .select('name email phone role status partner')
    ]);

    return {
      summary: {
        totalOrders,
        productOrders,
        serviceOrders,
        pendingOrders,
        assignedOrders,
        inProgressOrders,
        completedOrders,
        cancelledOrders,
        totalProducts,
        activeProducts,
        totalServices,
        activeServices,
        totalPartners,
        pendingApplications,
        approvedPartners,
        activeAllocations
      },
      recentOrders,
      topPartners: await Promise.all(topPartners.map((partner) => getPartnerLean(partner)))
    };
  },

  listOrders: async (query = {}) => {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.partnerStatus) filter.partnerStatus = query.partnerStatus;
    if (query.itemType) filter.itemType = query.itemType;
    if (query.assignedPartner) filter.assignedPartner = query.assignedPartner;
    if (query.paymentStatus) filter['payment.status'] = query.paymentStatus;
    if (query.search) {
      const regex = buildSearchRegex(query.search);
      if (regex) {
        filter.$or = [
          { 'itemSnapshot.name': regex },
          { contactName: regex },
          { contactEmail: regex },
          { notes: regex }
        ];
      }
    }

    return paginateModel({
      model: Order,
      filter,
      query,
      sort: { createdAt: -1 },
      populate: [
        { path: 'customer', select: 'name email role phone' },
        { path: 'assignedPartner', select: 'name email role partner' },
        'allocation'
      ]
    });
  },

  listProducts: async (query = {}) => paginateModel({
    model: Product,
    filter: query.includeInactive === 'true' ? {} : { active: true },
    query,
    sort: { createdAt: -1 }
  }),

  listServices: async (query = {}) => paginateModel({
    model: Service,
    filter: query.includeInactive === 'true' ? {} : { active: true },
    query,
    sort: { createdAt: -1 }
  }),

  listPartners: async (query = {}) => {
    const filter = { role: 'partner' };
    if (query.status) filter.status = query.status;
    if (query.partnerStatus) filter['partner.applicationStatus'] = query.partnerStatus;
    if (query.search) {
      const regex = buildSearchRegex(query.search);
      if (regex) {
        filter.$or = [
          { name: regex },
          { email: regex },
          { phone: regex },
          { 'partner.companyName': regex },
          { 'partner.city': regex }
        ];
      }
    }
    return paginateModel({
      model: User,
      filter,
      query,
      select: 'name email phone role status emailVerified lastLoginAt partner',
      sort: { 'partner.efficiencyScore': -1, 'partner.completedJobs': -1, createdAt: -1 }
    });
  },

  listApplications: async (query = {}) => {
    const filter = { role: 'partner' };
    if (query.status) filter.status = query.status;
    if (query.applicationStatus) filter['partner.applicationStatus'] = query.applicationStatus;
    if (query.search) {
      const regex = buildSearchRegex(query.search);
      if (regex) {
        filter.$or = [
          { name: regex },
          { email: regex },
          { phone: regex },
          { 'partner.companyName': regex },
          { 'partner.serviceCategories': regex }
        ];
      }
    }
    return paginateModel({
      model: User,
      filter,
      query,
      select: 'name email phone role status emailVerified createdAt lastLoginAt partner',
      sort: { createdAt: -1 }
    });
  },

  reviewPartner: async (partnerId, data, adminUser) => {
    const partner = await User.findById(partnerId);
    if (!partner || partner.role !== 'partner') {
      throw { status: 404, message: 'Partner application not found' };
    }
    partner.partner = partner.partner || {};

    const action = data.action || 'approve';
    const note = String(data.note || '').trim();
    partner.partner.reviewedAt = new Date();
    partner.partner.reviewedBy = adminUser ? adminUser._id : null;
    partner.partner.applicationNote = partner.partner.applicationNote || '';

    if (action === 'approve') {
      partner.partner.applicationStatus = 'approved';
      partner.partner.approvedAt = new Date();
      partner.partner.rejectionReason = '';
      partner.status = partner.emailVerified ? 'active' : 'pending_verification';
    } else if (action === 'reject') {
      partner.partner.applicationStatus = 'rejected';
      partner.partner.rejectionReason = note || 'Application rejected by admin';
      partner.partner.approvedAt = null;
      partner.status = 'pending_verification';
    } else if (action === 'suspend') {
      partner.partner.applicationStatus = 'suspended';
      partner.partner.suspendedAt = new Date();
      partner.status = 'suspended';
      partner.partner.rejectionReason = note || partner.partner.rejectionReason;
    } else {
      throw { status: 400, message: 'Invalid review action' };
    }

    await partner.save();
    return getPartnerLean(partner);
  },

  assignOrder: async (orderId, data, adminUser) => {
    const order = await Order.findById(orderId).populate('allocation');
    if (!order) {
      throw { status: 404, message: 'Order not found' };
    }

    const partner = await User.findById(data.partnerId);
    if (!partner || partner.role !== 'partner') {
      throw { status: 404, message: 'Partner not found' };
    }

    if (!['approved', 'active'].includes(partner.partner.applicationStatus)) {
      throw { status: 409, message: 'Partner is not approved for allocation' };
    }

    if (order.allocation) {
      const allocation = await JobAllocation.findById(order.allocation);
      if (allocation) {
        const previousPartnerId = String(allocation.partner);
        allocation.partner = partner._id;
        allocation.assignedBy = adminUser ? adminUser._id : allocation.assignedBy;
        if (data.notes !== undefined) allocation.notes = data.notes;
        if (data.adminNotes !== undefined) allocation.adminNotes = data.adminNotes;
        if (data.priority) allocation.priority = data.priority;
        if (data.scheduledFor !== undefined) allocation.scheduledFor = data.scheduledFor || null;
        if (data.estimatedMinutes !== undefined) {
          allocation.estimatedMinutes = Number.isFinite(Number(data.estimatedMinutes)) ? Number(data.estimatedMinutes) : allocation.estimatedMinutes;
        }
        allocation.status = data.status || 'assigned';
        await allocation.save();
        await refreshPartnerMetrics(previousPartnerId);
        return updateAllocationAndOrder(allocation, allocation.status, data);
      }
    }

    return createAllocation(order, partner, adminUser, data);
  },

  listAllocations: async (query = {}) => {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.partnerId) filter.partner = query.partnerId;
    if (query.orderId) filter.order = query.orderId;
    return paginateModel({
      model: JobAllocation,
      filter,
      query,
      sort: { createdAt: -1 },
      populate: [
        'order',
        { path: 'partner', select: 'name email phone role partner' },
        { path: 'assignedBy', select: 'name email role' }
      ]
    });
  },

  updateAllocationStatus: async (allocationId, data) => {
    const allocation = await JobAllocation.findById(allocationId);
    if (!allocation) {
      throw { status: 404, message: 'Allocation not found' };
    }

    return updateAllocationAndOrder(allocation, data.status, data);
  },

  partnerDashboard: async (partnerUser) => {
    const partner = await User.findById(partnerUser._id).select('name email phone role status emailVerified partner lastLoginAt');
    if (!partner || partner.role !== 'partner') {
      throw { status: 404, message: 'Partner not found' };
    }

    const [pendingJobs, activeJobs, completedJobs, allocations] = await Promise.all([
      JobAllocation.find({ partner: partner._id, status: { $in: ['assigned', 'accepted'] } })
        .sort({ createdAt: -1 })
        .limit(12)
        .populate('order')
        .populate('assignedBy', 'name email role'),
      JobAllocation.find({ partner: partner._id, status: 'in_progress' })
        .sort({ createdAt: -1 })
        .limit(12)
        .populate('order')
        .populate('assignedBy', 'name email role'),
      JobAllocation.find({ partner: partner._id, status: 'completed' })
        .sort({ completedAt: -1 })
        .limit(8)
        .populate('order')
        .populate('assignedBy', 'name email role'),
      JobAllocation.find({ partner: partner._id })
        .sort({ createdAt: -1 })
        .limit(12)
        .populate('order')
        .populate('assignedBy', 'name email role')
    ]);

    return {
      partner: await getPartnerLean(partner),
      pendingJobs,
      activeJobs,
      completedJobs,
      allocations,
      summary: {
        activeJobsCount: partner.partner.activeJobs || 0,
        completedJobsCount: partner.partner.completedJobs || 0,
        cancelledJobsCount: partner.partner.cancelledJobs || 0,
        efficiencyScore: partner.partner.efficiencyScore || 0,
        onTimeRate: partner.partner.onTimeRate || 0,
        ratingAverage: partner.partner.ratingAverage || 0,
        ratingCount: partner.partner.ratingCount || 0
      }
    };
  },

  partnerJobs: async (partnerUser, query = {}) => {
    const filter = { partner: partnerUser._id };
    if (query.status) filter.status = query.status;
    return paginateModel({
      model: JobAllocation,
      filter,
      query,
      sort: { createdAt: -1 },
      populate: [
        'order',
        { path: 'assignedBy', select: 'name email role' }
      ]
    });
  },

  partnerUpdateJobStatus: async (partnerUser, allocationId, data) => {
    const allocation = await JobAllocation.findOne({ _id: allocationId, partner: partnerUser._id });
    if (!allocation) {
      throw { status: 404, message: 'Job not found' };
    }

    const allowed = ['accepted', 'in_progress', 'completed', 'cancelled', 'rejected'];
    if (!allowed.includes(data.status)) {
      throw { status: 400, message: 'Invalid job status' };
    }

    return updateAllocationOnly(allocation, data.status, data);
  },

  normalizeTextList
};
