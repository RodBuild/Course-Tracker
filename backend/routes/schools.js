const router = require('express').Router();
const controller = require('../controllers/schools');
const validation = require('../validation/middleware');
const { requiresAuth } = require('express-openid-connect');

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);
router.post('/', requiresAuth(), validation.validateSchool, controller.createNewSchool);
router.put('/:id', requiresAuth(), validation.validateSchool, controller.editSchool);
router.delete('/:id', requiresAuth(), controller.deleteSchool);

module.exports = router;
