const orderService = require('../services/order.service');

module.exports = {
  createPublic: async (req, res, next) => {
    try {
      const order = await orderService.createPublic(req.body);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const order = await orderService.create(req.user, req.body);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  },
  listMine: async (req, res, next) => {
    try {
      const orders = await orderService.listMine(req.user, req.query);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },
  listAll: async (req, res, next) => {
    try {
      const orders = await orderService.listAll(req.query);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const order = await orderService.getById(req.user, req.params.id);
      res.json(order);
    } catch (err) {
      next(err);
    }
  },
  updateStatus: async (req, res, next) => {
    try {
      const order = await orderService.updateStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (err) {
      next(err);
    }
  }
};
