const validator = require('./validate');

/* For validating school creation */
const validateSchool = (req, res, next) => {
  const validationRule = {
    name: 'required|string|max:100',
    city: 'required|string|max:50',
    state: 'required|string|max:25',
    description: 'required|string|min:10|max:500'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

/* For validating course creation */
const validateCourse = (req, res, next) => {
  const validationRule = {
    code: 'required|string|min:3|max:10',
    name: 'required|string|min:3|max:70',
    description: 'required|string|min:10|max:500',
    credits: 'required|string|min:1|max:1',
    school: 'required|string|min:3|max:100'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

/* For validating tracker creation */
const validateTracker = (req, res, next) => {
  const validationRule = {
    user_email: 'required|email',
    school: 'required|string|min:3|max:100',
    course_code: 'required|string|min:3|max:10',
    grade: 'required|string',
    tags: 'required',
    review: 'required|string|min:10|max:500',
    verified: 'required|string|min:3|max:5'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

/* For validating user data */
const validateUser = (req, res, next) => {
  const validationRule = {
    fname: 'required|string|max:30',
    lname: 'required|string|max:30',
    major: 'required|string|max:30',
    school: 'required|string|min:3|max:100',
    //school_email: 'required|email',
    school_id: 'required|string|min:10|max:10',
    verified: 'required|string|min:3|max:5'
  };
  // console.log(req);
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  validateSchool,
  validateCourse,
  validateTracker,
  validateUser,
  
};
