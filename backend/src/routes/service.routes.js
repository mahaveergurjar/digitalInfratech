const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/service.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const router = express.Router();

router.get('/', controller.list);
router.get('/:id', [
  param('id').isMongoId().withMessage('Valid service id is required')
], validate, controller.getById);

router.post('/', authenticate, authorize('admin'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required')
], validate, controller.create);

router.patch('/:id', authenticate, authorize('admin'), [
  param('id').isMongoId().withMessage('Valid service id is required')
], validate, controller.update);

router.delete('/:id', authenticate, authorize('admin'), [
  param('id').isMongoId().withMessage('Valid service id is required')
], validate, controller.remove);

module.exports = router;
