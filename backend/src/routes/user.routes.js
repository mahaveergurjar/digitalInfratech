const express = require('express');
const controller = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const router = express.Router();

router.get('/', authenticate, authorize('admin'), controller.list);

module.exports = router;
