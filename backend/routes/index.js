const router = require('express').Router();
const schools = require('./schools');
const courses = require('./courses');
const users = require('./users');
const reviews = require('./reviews');
const admin = require('./admin');

/* TODO 
    Schools -> routes -> controllers -> validation
    Users -> routes -> controllers -> validation -> create and update will always default verified to FALSE
    Courses -> routes -> controllers -> validation
    Admin -> PROBABLY DONE?
    Reviews -> routes -> controllers -> needs validation
    
    ONLY THING LEFT:
        SWAGGER.JSON
        ADD 401:Unathorized to swagger.json
*/

/* API requests */
router.use('/schools', schools);
router.use('/users', users);
router.use('/courses', courses);
router.use('/admin', admin);
router.use('/reviews', reviews);

module.exports = router;
