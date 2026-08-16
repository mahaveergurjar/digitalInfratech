const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/payment.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/', controller.list);
router.patch('/:id/verify', [
  param('id').isMongoId().withMessage('Valid payment id is required'),
  body('note').optional().isString(),
], validate, controller.verify);

router.patch('/:id/reject', [
  param('id').isMongoId().withMessage('Valid payment id is required'),
  body('reason').optional().isString(),
  body('note').optional().isString()
], validate, controller.reject);

module.exports = router;
