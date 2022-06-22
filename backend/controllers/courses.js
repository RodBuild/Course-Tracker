/* FOR REFERENCE */
/*
    Mathematics, Computer Science, Biology, Art, Education, Business, History, Humanities
    Some need to be rethinked, should be block some requests to the admins??
    */
const admin = require('../validation/admin');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const { validationResult } = require('express-validator');

/********************************
 * To get all valid courses:    *
 *    Takes no params           *
 ********************************/
const getAllValidCourses = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('courses')
      .find()
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No data was found`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/********************************
 * To get one valid courses:    *
 *    Takes an id               *
 ********************************/
const getById = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID');
  } else {
    const courseId = new ObjectId(req.params.id);
    mongodb
      .getDb()
      .db()
      .collection('courses')
      .find({ _id: courseId })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No data was found`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  }
};

/********************************
 * To get all valid courses:    *
 *    Takes a school name       *
 ********************************/
const getBySchool = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('courses')
      .find({ school: req.params.school })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No data was found`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/********************************
 * To get all valid courses:    *
 *    Takes a department        *
 ********************************/
const getByDepartment = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('courses')
      .find({ department: req.params.department })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No data was found`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/********************************
 * To get one valid courses:    *
 *    Takes a course code       *
 ********************************/
const getValidCourseByCode = async (req, res) => {
  console.log('stop');
  try {
    mongodb
      .getDb()
      .db()
      .collection('courses')
      .find({ code: req.params.code })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No data was found`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**********************************
 * To get one invalid courses:    *
 *    Takes a course code         *
 **********************************/
const getInvalidCourseByCode = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('courses_unverified')
      .find({ code: req.params.code })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No data was found`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**********************************
 * To get all invalid courses:    *
 *    Takes no params             *
 **********************************/
const getAllInvalidCourses = async (req, res) => {
  mongodb
    .getDb()
    .db()
    .collection('courses_unverified')
    .find()
    .toArray((err, result) => {
      if (result.length === 0) {
        res.status(404).json(`No data was found`);
      } else if (err) {
        res.status(400).json({ message: err });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
      }
    });
};

/**********************************
 * To get all invalid courses:    *
 *    Takes an email              *
 **********************************/
const getInvalidCoursesByEmail = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('courses_unverified')
      .find({ author: req.params.email })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No data was found`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/****************************************************
 * To get all invalid courses from current user:    *
 *    Takes no params                               *
 ****************************************************/
const getCurrentUserCourses = async (req, res) => {
  const userEmail = req.oidc.user.email;
  try {
    mongodb
      .getDb()
      .db()
      .collection('courses_unverified')
      .find({ author: userEmail })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No data was found`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/******************************
 * To create a new course:    *
 *    Takes no params - ADMIN *
 ******************************/
// FOR ADMINs only
const postAdminNewCourse = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  const courseExists = await admin.courseValidExists(req.body.code);
  if (courseExists) {
    return res.status(400).json('Course already exists');
  }
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Errors: errors.array() });
  }
  const newCourse = {
    code: req.body.code.toUpperCase(),
    department: req.body.department,
    name: req.body.name,
    description: req.body.description,
    credits: req.body.credits,
    school: req.body.school
  };
  const response = await mongodb.getDb().db().collection('courses').insertOne(newCourse);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to add a course.`);
  }
};

/*****************************************
 * To create a new unverified course:    *
 *    Takes no params - NO ADMIN         *
 *****************************************/
const postUserNewCourse = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  const courseExists = await admin.courseInvalidExists(req.body.code);
  if (courseExists) {
    return res.status(400).json('Course already exists');
  }
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Errors: errors.array() });
  }
  const newCourse = {
    author: `${userEmail}`,
    code: req.body.code.toUpperCase(),
    department: req.body.department,
    name: req.body.name,
    description: req.body.description,
    credits: req.body.credits,
    school: req.body.school
  };
  const response = await mongodb.getDb().db().collection('courses_unverified').insertOne(newCourse);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to add your custom course.`);
  }
};

/***********************************
 * To update a verified course:    *
 *    Takes a code - ADMIN         *
 ***********************************/
//FOR ADMINs only
const updateAdminCourse = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Errors: errors.array() });
  }
  const newCourse = {
    code: req.body.code.toUpperCase(),
    department: req.body.department,
    name: req.body.name,
    description: req.body.description,
    credits: req.body.credits,
    school: req.body.school
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('courses')
    .replaceOne({ code: req.params.code }, newCourse);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to update a course.`);
  }
};

/**************************************
 * To update an unverified course:    *
 *    Takes a code - NO ADMIN         *
 **************************************/
const updateUserCourse = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Errors: errors.array() });
  }
  const newCourse = {
    author: `${userEmail}`,
    code: req.body.code.toUpperCase(),
    department: req.body.department,
    name: req.body.name,
    description: req.body.description,
    credits: req.body.credits,
    school: req.body.school
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('courses_unverified')
    .updateMany({ code: req.params.code, author: `${userEmail}` }, { $set: newCourse });
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || `Something went wrong while attempting to update your custom course.`
      );
  }
};

/***********************************
 * To delete a verified course:    *
 *    Takes a code - ADMIN         *
 ***********************************/
//FOR ADMINs only
const deleteAdminCourse = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  const response = await mongodb
    .getDb()
    .db()
    .collection('courses')
    .deleteOne({ code: req.params.code }, true);
  if (respose.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to delete a course.`);
  }
};

/**************************************
 * To delete an unverified course:    *
 *    Takes a code - NO ADMIN         *
 **************************************/
const deleteUserCourse = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  const response = await mongodb
    .getDb()
    .db()
    .collection('courses_unverified')
    .deleteMany({ code: req.params.code, author: `${userEmail}` }, true);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(
        response.error || `Something went wrong while attempting to delete your custom course.`
      );
  }
};

module.exports = {
  getAllValidCourses,
  getById,
  getBySchool,
  getByDepartment,
  getInvalidCourseByCode,
  getValidCourseByCode,
  getAllInvalidCourses,
  getInvalidCoursesByEmail,
  getCurrentUserCourses,
  postAdminNewCourse,
  postUserNewCourse,
  updateAdminCourse,
  updateUserCourse,
  deleteAdminCourse,
  deleteUserCourse
};
