const router = require('express').Router();
const schools = require('./schools');
const courses = require('./courses');
const users = require('./users');
const reviews = require('./reviews');
const admin = require('./admin');
const { route } = require('./schools');

/* TODO 
    Schools -> routes -> controllers -> validation
    Users -> routes -> controllers -> validation
    Courses -> 
    Admin -> 
    Reviews -> 


*/

/* API requests */
router.use('/schools', schools);
router.use('/users', users);
router.use('/courses', courses);
router.use('/admin', admin);
router.use('/reviews', reviews);

module.exports = router;
