const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/partner.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.use(authenticate, authorize('partner'));

router.get('/dashboard', controller.dashboard);
router.get('/jobs', controller.jobs);

router.patch('/jobs/:id', [
  param('id').isMongoId().withMessage('Valid job id is required'),
  body('status').isIn(['accepted', 'in_progress', 'completed', 'cancelled', 'rejected']).withMessage('Valid job status is required'),
  body('notes').optional().isString(),
  body('estimatedMinutes').optional().isInt({ min: 0 }).withMessage('Valid estimated minutes are required'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Valid priority is required')
], validate, controller.updateJob);

module.exports = router;
