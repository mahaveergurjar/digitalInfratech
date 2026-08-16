const User = require('../models/user.model');
const { paginateModel } = require('../utils/pagination');

module.exports = {
  list: async (query = {}) => {
    return paginateModel({
      model: User,
      query,
      select: '-password',
      sort: { createdAt: -1 }
    });
  }
};
