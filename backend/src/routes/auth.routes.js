const express = require('express');
const { body } = require('express-validator');
const controller = require('../controllers/auth.controller');
const { auth } = require('../config/env');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const createRateLimit = require('../middlewares/rateLimit.middleware');
const { hashValue } = require('../utils/crypto');
const router = express.Router();

const strongPassword = () => body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/\d/)
  .withMessage('Password must contain at least one number');

const keyFrom = (...parts) => hashValue(parts.filter(Boolean).join('|'));

router.post('/register', createRateLimit({
  ...auth.rateLimits.register,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.email || '').toLowerCase())
}), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  strongPassword(),
  body('role').optional().isIn(['customer', 'partner']).withMessage('Valid account type is required'),
  body('phone').optional().isString(),
  body('companyName').optional().isString(),
  body('city').optional().isString(),
  body('serviceCategories').optional(),
  body('serviceAreas').optional(),
  body('bio').optional().isString(),
  body('experienceYears').optional().isInt({ min: 0 }),
  body('maxConcurrentJobs').optional().isInt({ min: 1 }),
  body('applicationNote').optional().isString()
], validate, controller.register);

router.get('/verify-email', controller.verifyEmailPage);
router.post('/verify-email', createRateLimit({
  ...auth.rateLimits.verifyEmail,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.code || ''))
}), [
  body('code').isLength({ min: 6, max: 6 }).withMessage('Verification code is required')
], validate, controller.verifyEmail);

router.post('/resend-verification', createRateLimit({
  ...auth.rateLimits.resendVerification,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.email || '').toLowerCase())
}), [
  body('email').isEmail().withMessage('Valid email is required')
], validate, controller.resendVerification);

router.post('/login', createRateLimit({
  ...auth.rateLimits.login,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.email || '').toLowerCase())
}), [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, controller.login);

router.post('/login/verify-code', createRateLimit({
  ...auth.rateLimits.loginVerifyCode,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.challengeId || ''))
}), [
  body('challengeId').isMongoId().withMessage('Valid login challenge is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Valid verification code is required')
], validate, controller.verifyLoginCode);

router.post('/login/resend-code', createRateLimit({
  ...auth.rateLimits.resendLoginCode,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.challengeId || ''))
}), [
  body('challengeId').isMongoId().withMessage('Valid login challenge is required')
], validate, controller.resendLoginCode);

router.post('/refresh', createRateLimit({
  ...auth.rateLimits.refresh,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.refreshToken || ''))
}), [
  body('refreshToken').notEmpty().withMessage('Refresh token is required')
], validate, controller.refresh);

router.post('/logout', createRateLimit({
  ...auth.rateLimits.logout,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.refreshToken || ''))
}), controller.logout);

router.post('/forgot-password', createRateLimit({
  ...auth.rateLimits.forgotPassword,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.email || '').toLowerCase())
}), [
  body('email').isEmail().withMessage('Valid email is required')
], validate, controller.forgotPassword);

router.get('/reset-password', controller.resetPasswordPage);
router.post('/reset-password', createRateLimit({
  ...auth.rateLimits.resetPassword,
  keyGenerator: (req) => keyFrom(req.ip, String(req.body.code || ''))
}), [
  body('code').isLength({ min: 6, max: 6 }).withMessage('Reset code is required'),
  strongPassword()
], validate, controller.resetPassword);

router.post('/change-password', authenticate, createRateLimit({
  ...auth.rateLimits.changePassword,
  keyGenerator: (req) => keyFrom(req.ip, String(req.user?._id || ''))
}), [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
], validate, controller.changePassword);

router.get('/me', authenticate, controller.me);

module.exports = router;
