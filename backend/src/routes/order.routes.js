const express = require('express');
const mongoose = require('mongoose');
const { body, param } = require('express-validator');
const controller = require('../controllers/order.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

// Public order endpoint - NO authentication required
router.post('/public/create', [
  body('productId').isMongoId().withMessage('Valid product id is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').trim().notEmpty().withMessage('Phone number is required'),
  body('address').trim().notEmpty().withMessage('Address is required')
], validate, controller.createPublic);

router.post('/', authenticate, [
  body('itemType').isIn(['product', 'service']).withMessage('Valid order item type is required'),
  body('productId').custom((value, { req }) => {
    if (req.body.itemType === 'product') {
      if (!value) {
        throw new Error('Product id is required for product orders');
      }
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Valid product id is required');
      }
    }
    if (req.body.itemType === 'service' && value) {
      throw new Error('Product id must not be sent for service orders');
    }
    return true;
  }),
  body('serviceId').custom((value, { req }) => {
    if (req.body.itemType === 'service') {
      if (!value) {
        throw new Error('Service id is required for service orders');
      }
      if (!mongoose.isValidObjectId(value)) {
        throw new Error('Valid service id is required');
      }
    }
    if (req.body.itemType === 'product' && value) {
      throw new Error('Service id must not be sent for product orders');
    }
    return true;
  }),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('contactName').trim().notEmpty().withMessage('Contact name is required'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required'),
  body('address').trim().notEmpty().withMessage('Address is required')
], validate, controller.create);

router.get('/mine', authenticate, controller.listMine);
router.get('/:id', authenticate, [
  param('id').isMongoId().withMessage('Valid order id is required')
], validate, controller.getById);
router.get('/', authenticate, authorize('admin'), controller.listAll);

router.patch('/:id/status', authenticate, authorize('admin'), [
  param('id').isMongoId().withMessage('Valid order id is required'),
  body('status').isIn(['pending', 'confirmed', 'assigned', 'in_progress', 'fulfilled', 'completed', 'cancelled', 'on_hold']).withMessage('Valid order status is required')
], validate, controller.updateStatus);

module.exports = router;
