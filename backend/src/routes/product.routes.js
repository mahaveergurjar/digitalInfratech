const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/product.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.get('/', controller.list);
router.get('/:id', [
  param('id').isMongoId().withMessage('Valid product id is required')
], validate, controller.getById);

router.post('/', authenticate, authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required')
], validate, controller.create);

router.patch('/:id', authenticate, authorize('admin'), [
  param('id').isMongoId().withMessage('Valid product id is required')
], validate, controller.update);

router.delete('/:id', authenticate, authorize('admin'), [
  param('id').isMongoId().withMessage('Valid product id is required')
], validate, controller.remove);

module.exports = router;
