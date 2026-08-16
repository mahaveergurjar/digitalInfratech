const operations = require('../services/operations.service');

module.exports = {
  dashboard: async (req, res, next) => {
    try {
      const data = await operations.partnerDashboard(req.user);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  jobs: async (req, res, next) => {
    try {
      const data = await operations.partnerJobs(req.user, req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  updateJob: async (req, res, next) => {
    try {
      const allocation = await operations.partnerUpdateJobStatus(req.user, req.params.id, req.body);
      res.json(allocation);
    } catch (err) {
      next(err);
    }
  }
};
