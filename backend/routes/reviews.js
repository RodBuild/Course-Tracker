const router = require('express').Router();
const controller = require('../controllers/reviews');
const validation = require('../validation/middleware');
const { body } = require('express-validator');
const { requiresAuth } = require('express-openid-connect');
// to do, are grades by 0-100? or A-F????
// check that user does not already have a review under a specific (valid) course, (invalid) course as well?

router.get('/valid', controller.getAllVerifiedReviews);
router.get('/invalid', controller.getAllUnverifiedReviews);
router.get('/user-valid', controller.getCurrentUserValidReviews);
router.get('/user-invalid', controller.getCurrentUserInvalidReviews);
router.post('/new-review/', controller.createReview);
router.put('/update-review/:code', controller.updateReview);
router.delete('/delete-review/:code', controller.deleteReview);

module.exports = router;
