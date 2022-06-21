const router = require('express').Router();
const controller = require('../controllers/users');
const validation = require('../validation/middleware');
const { body } = require('express-validator');
const { requiresAuth } = require('express-openid-connect');

router.get('/', requiresAuth(), controller.getUserData);
router.get('/:email', requiresAuth(), controller.getAnotherUserDataByEmail);
router.post(
  '/',
  requiresAuth(),
  body('school_id', 'value needs to be 10 characters long').isLength({ min: 10, max: 10 }),
  // body('verified', 'value can only be true or false').isIn(['true', 'false']),
  validation.validateUser,
  controller.createUserData
);
router.put(
  '/',
  requiresAuth(),
  body('school_id', 'value needs to be 10 characters long').isLength({ min: 10, max: 10 }),
  // body('verified', 'value can only be true or false').isIn(['true', 'false']),
  validation.validateUser,
  controller.updateUserData
);
router.delete('/:id', requiresAuth(), controller.deleteUserData);

module.exports = router;
