const serviceService = require('../services/service.service');

module.exports = {
  list: async (req, res, next) => {
    try {
      const services = await serviceService.list(req.query);
      res.json(services);
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const service = await serviceService.getById(req.params.id);
      res.json(service);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const service = await serviceService.create(req.body);
      res.status(201).json(service);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const service = await serviceService.update(req.params.id, req.body);
      res.json(service);
    } catch (err) {
      next(err);
    }
  },
  remove: async (req, res, next) => {
    try {
      const result = await serviceService.remove(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
