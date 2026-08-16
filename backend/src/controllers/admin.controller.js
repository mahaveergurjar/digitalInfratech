const operations = require('../services/operations.service');

module.exports = {
  overview: async (req, res, next) => {
    try {
      const data = await operations.overview();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  orders: async (req, res, next) => {
    try {
      const data = await operations.listOrders(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  products: async (req, res, next) => {
    try {
      const data = await operations.listProducts(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  services: async (req, res, next) => {
    try {
      const data = await operations.listServices(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  partners: async (req, res, next) => {
    try {
      const data = await operations.listPartners(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  applications: async (req, res, next) => {
    try {
      const data = await operations.listApplications(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  reviewPartner: async (req, res, next) => {
    try {
      const partner = await operations.reviewPartner(req.params.id, req.body, req.user);
      res.json(partner);
    } catch (err) {
      next(err);
    }
  },
  assignOrder: async (req, res, next) => {
    try {
      const allocation = await operations.assignOrder(req.params.id, req.body, req.user);
      res.status(201).json(allocation);
    } catch (err) {
      next(err);
    }
  },
  allocations: async (req, res, next) => {
    try {
      const data = await operations.listAllocations(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  updateAllocation: async (req, res, next) => {
    try {
      const allocation = await operations.updateAllocationStatus(req.params.id, req.body);
      res.json(allocation);
    } catch (err) {
      next(err);
    }
  }
};
