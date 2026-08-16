const Product = require('../models/product.model');
const { paginateModel } = require('../utils/pagination');
const { buildSearchRegex } = require('../utils/search');

module.exports = {
  list: async (query = {}) => {
    const filter = {};
    if (query.includeInactive !== 'true') {
      filter.active = true;
    }
    if (query.category) filter.category = query.category;
    if (query.active === 'true') filter.active = true;
    if (query.active === 'false') filter.active = false;
    if (query.search) {
      const regex = buildSearchRegex(query.search);
      if (regex) {
      filter.$or = [
          { name: regex },
          { brand: regex },
          { category: regex }
        ];
      }
    }

    return paginateModel({
      model: Product,
      filter,
      query,
      sort: { createdAt: -1 }
    });
  },
  getById: async (id) => {
    const product = await Product.findById(id);
    if (!product || !product.active) {
      throw { status: 404, message: 'Product not found' };
    }
    return product;
  },
  create: async (data) => Product.create(data),
  update: async (id, data) => {
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  },
  remove: async (id) => {
    const product = await Product.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!product) throw { status: 404, message: 'Product not found' };
    return { success: true, message: 'Product archived successfully' };
  }
};
