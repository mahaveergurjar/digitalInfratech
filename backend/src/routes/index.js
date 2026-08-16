const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/partner', require('./partner.routes'));
router.use('/payments', require('./payment.routes'));
router.use('/services', require('./service.routes'));
router.use('/products', require('./product.routes'));
router.use('/orders', require('./order.routes'));

module.exports = router;
