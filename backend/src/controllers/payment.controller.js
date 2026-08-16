const paymentService = require('../services/payment.service');

module.exports = {
  list: async (req, res, next) => {
    try {
      const payments = await paymentService.list(req.query);
      res.json(payments);
    } catch (err) {
      next(err);
    }
  },
  verify: async (req, res, next) => {
    try {
      const payment = await paymentService.verify(req.params.id, req.user, req.body);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  },
  reject: async (req, res, next) => {
    try {
      const payment = await paymentService.reject(req.params.id, req.user, req.body);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  }
};
