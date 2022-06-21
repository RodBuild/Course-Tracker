const router = require('express').Router();
const controller = require('../controllers/reviews');
const validation = require('../validation/middleware');
const { body } = require('express-validator');
const { requiresAuth } = require('express-openid-connect');

router.get('/valid', controller.getAllVerifiedReviews);
router.get('/invalid', controller.getAllUnverifiedReviews);
router.get('/user-valid', controller.getCurrentUserValidReviews);
router.get('/user-invalid', controller.getCurrentUserInvalidReviews);

module.exports = router;
