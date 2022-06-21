const router = require('express').Router();
const controller = require('../controllers/courses');
const validation = require('../validation/middleware');
const { body } = require('express-validator');
const { requiresAuth } = require('express-openid-connect');

// getall
router.get('/valid', controller.getAllValidCourses);
router.get('/valid/:id', controller.getById);
router.get('/invalid', controller.getAllInvalidCourses);
router.get('/invalid/user', requiresAuth(), controller.getCurrentUserCourses);
router.get('/invalid/:email', controller.getInvalidReviewsByEmail);
router.get('/school/:school', controller.getBySchool);
router.get('/department/:department', controller.getByDepartment);
router.get('/code/:code', controller.getByCourseCode);

router.post(
  '/valid/admin',
  body('credits', 'Check your quanitity of credits').isInt({ min: 0, max: 10 }),
  requiresAuth(),
  validation.validateCourse,
  controller.postAdminNewCourse
);

router.post(
  '/invalid/user',
  requiresAuth(),
  validation.validateCourse,
  controller.postUserNewCourse
);

router.put(
  '/valid/admin/:code',
  requiresAuth(),
  validation.validateCourse,
  controller.updateAdminCourse
);

router.put(
  '/invalid/user/:code',
  requiresAuth(),
  validation.validateCourse,
  controller.updateUserCourse
); // all course code under the code will be updated

router.delete('/valid/admin/:code', requiresAuth(), controller.deleteAdminCourse);

router.delete('/invalid/user/:code', requiresAuth(), controller.deleteUserCourse); // all course code under the code will be deleted
/*
get one, get by university,

*/

module.exports = router;
