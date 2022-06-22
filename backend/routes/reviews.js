const router = require('express').Router();
const controller = require('../controllers/reviews');
const validation = require('../validation/middleware');
const { body } = require('express-validator');
const { requiresAuth } = require('express-openid-connect');
// to do, are grades by 0-100? or A-F????
// check that user does not already have a review under a specific (valid) course, (invalid) course as well?

router.get('/valid', controller.getAllVerifiedReviews);
router.get('/invalid', controller.getAllUnverifiedReviews);
router.get('/user-valid', requiresAuth(), controller.getCurrentUserValidReviews);
router.get('/user-invalid', requiresAuth(), controller.getCurrentUserInvalidReviews);
router.get('/code/:code', controller.getReviewsByCourseCode);
router.get('/email/:email', controller.getReviewsByEmail);
router.post(
  '/new-review/',
  requiresAuth(),
  body('grade', 'range is from 0 to 100, with decimals allowed').isFloat({ min: 0, max: 100 }),
  body('tags', 'three tags only').isArray({ min: 3, max: 3 }),
  validation.validateReview,
  controller.createReview
);
router.put(
  '/update-review/:code',
  body('grade', 'range is from 0 to 100, with decimals allowed').isFloat({ min: 0, max: 100 }),
  body('tags', 'three tags only').isArray({ min: 3, max: 3 }),
  requiresAuth(),
//   validation.validateReview,
  controller.updateReview
);
router.delete('/delete-review/:code', requiresAuth(), controller.deleteReview);

module.exports = router;
