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
router.get('/invalid/:email', controller.getInvalidCoursesByEmail);
router.get('/school/:school', controller.getBySchool);
router.get('/department/:department', controller.getByDepartment);
router.get('/code/:code', controller.getByCourseCode);

router.post(
  '/valid/admin',
  requiresAuth(),
  body('credits', 'Credits shall only be between 1 to 10').isInt({ min: 1, max: 10 }),
  validation.validateCourse,
  controller.postAdminNewCourse
);

router.post(
  '/invalid/user',
  requiresAuth(),
  body('credits', 'Credits shall only be between 1 to 10').isInt({ min: 1, max: 10 }),
  //   validation.validateCourse,
  controller.postUserNewCourse
);

router.put(
  '/valid/admin/:code',
  requiresAuth(),
  body('credits', 'Credits shall only be between 1 to 10').isInt({ min: 1, max: 10 }),
  validation.validateCourse,
  controller.updateAdminCourse
);

router.put(
  '/invalid/user/:code',
  requiresAuth(),
  body('credits', 'Credits shall only be between 1 to 10').isInt({ min: 1, max: 10 }),
  validation.validateCourse,
  controller.updateUserCourse
); // all course code under the code will be updated

router.delete('/valid/admin/:code', requiresAuth(), controller.deleteAdminCourse);

router.delete('/invalid/user/:code', requiresAuth(), controller.deleteUserCourse); // all course code under the code will be deleted
/*
get one, get by university,

*/

module.exports = router;
