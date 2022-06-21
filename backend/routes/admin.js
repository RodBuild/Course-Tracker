const router = require('express').Router();
const admin = require('../validation/admin');
const controller = require('../controllers/admin');
const validation = require('../validation/middleware');
const { body } = require('express-validator');
const { requiresAuth } = require('express-openid-connect');
const { route } = require('./schools');

router.get('/invalid-users', controller.getAllUnverifiedUsers);
router.get('/valid-users', controller.getAllVerifiedUsers);
router.put('/verify-user/:email', controller.verifyUser);
router.put('/verify-review/:id', controller.verifyReview);
router.post('/ban-user/:email', controller.banUser);

router.use('/', async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  } else {
    return res.status(418).json(`Welcome ${userEmail}`);
  }
});

module.exports = router;
