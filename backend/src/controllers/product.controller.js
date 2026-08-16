const productService = require('../services/product.service');

module.exports = {
  list: async (req, res, next) => {
    try {
      const products = await productService.list(req.query);
      res.json(products);
    } catch (err) {
      next(err);
    }
  },
  getById: async (req, res, next) => {
    try {
      const product = await productService.getById(req.params.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },
  remove: async (req, res, next) => {
    try {
      const result = await productService.remove(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
