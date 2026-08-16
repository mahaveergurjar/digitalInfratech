const Service = require('../models/service.model');
const { paginateModel } = require('../utils/pagination');
const { buildSearchRegex } = require('../utils/search');

module.exports = {
  list: async (query = {}) => {
    const filter = {};
    if (query.category) filter.category = query.category;
    if (query.active === 'true') filter.active = true;
    if (query.active === 'false') filter.active = false;
    if (query.search) {
      const regex = buildSearchRegex(query.search);
      if (regex) {
        filter.$or = [
          { name: regex },
          { category: regex },
          { subCategory: regex }
        ];
      }
    }
    return paginateModel({
      model: Service,
      filter,
      query,
      sort: { createdAt: -1 }
    });
  },
  getById: async (id) => {
    const service = await Service.findById(id);
    if (!service || service.active === false) throw { status: 404, message: 'Service not found' };
    return service;
  },
  create: async (data) => {
    return Service.create(data);
  },
  update: async (id, data) => {
    const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!service) throw { status: 404, message: 'Service not found' };
    return service;
  },
  remove: async (id) => {
    const service = await Service.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!service) throw { status: 404, message: 'Service not found' };
    return { success: true, message: 'Service archived successfully' };
  }
};
