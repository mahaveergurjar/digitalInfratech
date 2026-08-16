const userService = require('../services/user.service');

module.exports = {
  list: async (req, res, next) => {
    try {
      const users = await userService.list(req.query);
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
};
