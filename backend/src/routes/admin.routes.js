const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/admin.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/overview', controller.overview);
router.get('/orders', controller.orders);
router.get('/products', controller.products);
router.get('/services', controller.services);
router.get('/partners', controller.partners);
router.get('/applications', controller.applications);
router.get('/allocations', controller.allocations);

router.post('/orders/:id/assign', [
  param('id').isMongoId().withMessage('Valid order id is required'),
  body('partnerId').isMongoId().withMessage('Valid partner id is required'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Valid priority is required'),
  body('status').optional().isIn(['assigned', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled']).withMessage('Valid allocation status is required'),
  body('scheduledFor').optional().isISO8601().withMessage('Valid schedule date is required'),
  body('estimatedMinutes').optional().isInt({ min: 0 }).withMessage('Valid estimated minutes are required')
], validate, controller.assignOrder);

router.patch('/allocations/:id', [
  param('id').isMongoId().withMessage('Valid allocation id is required'),
  body('status').isIn(['assigned', 'accepted', 'in_progress', 'completed', 'rejected', 'cancelled']).withMessage('Valid allocation status is required')
], validate, controller.updateAllocation);

router.patch('/partners/:id/review', [
  param('id').isMongoId().withMessage('Valid partner id is required'),
  body('action').isIn(['approve', 'reject', 'suspend']).withMessage('Valid review action is required'),
  body('note').optional().isString()
], validate, controller.reviewPartner);

module.exports = router;
