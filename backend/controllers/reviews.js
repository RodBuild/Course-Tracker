const admin = require('../validation/admin');
const mongodb = require('../database/connect');
const { validationResult } = require('express-validator');

// get reviews by course code
// essentially, reviews are "attached" to one course

const getAllVerifiedReviews = async (req, res) => {
  const data = await mongodb.getDb().db().collection('users_reviews').find({ verified: 'true' });
  data.toArray((err, lists) => {
    if (lists.length === 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json('No data was found');
    } else if (err) {
      res.status(400).json({ message: err });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    }
  });
};

const getAllUnverifiedReviews = async (req, res) => {
  const data = await mongodb.getDb().db().collection('users_reviews').find({ verified: 'false' });
  data.toArray((err, lists) => {
    if (lists.length === 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json('No data was found');
    } else if (err) {
      res.status(400).json({ message: err });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    }
  });
};

const getCurrentUserValidReviews = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  const data = await mongodb
    .getDb()
    .db()
    .collection('users_reviews')
    .find({ email: userEmail, verified: 'true' });
  data.toArray((err, lists) => {
    if (lists.length === 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json('No data was found');
    } else if (err) {
      res.status(400).json({ message: err });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    }
  });
};

const getCurrentUserInvalidReviews = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  const data = await mongodb
    .getDb()
    .db()
    .collection('users_reviews')
    .find({ email: userEmail, verified: 'false' });
  data.toArray((err, lists) => {
    if (lists.length === 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json('No data was found');
    } else if (err) {
      res.status(400).json({ message: err });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    }
  });
};

// get all reviews unde a course by course code
const getReviewsByCourseCode = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('users_reviews')
      .find({ course_code: req.params.code.toUpperCase() })
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

// get other users reviews -> all
const getReviewsByEmail = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('users_reviews')
      .find({ email: req.params.email.toLowerCase() })
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

// TODO: POST, PUT, DELETE - LATER
// is it up to the front end to pass a valid course code
// every new review is marked as unverified
// NO ADMINS!
const createReview = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Errors: errors.array() });
  }
  const reviewExists = await admin.reviewExists(userEmail, req.body.code);
  if (reviewExists) {
    return res.status(400).json('Review already exists');
  }
  const newReview = {
    email: `${userEmail}`,
    school: req.body.school,
    course_code: req.body.code.toUpperCase(),
    grade: req.body.grade,
    tags: req.body.tags,
    review: req.body.review,
    verified: false
  };
  const response = await mongodb.getDb().db().collection('users_reviews').insertOne(newReview);
  if (response.acknowledged > 0) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to add your review.`);
  }
};

//use your oidc.email and pass the course code
const updateReview = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res
      .status(400)
      .json(
        'Administrator cannot run this request. You may want to delete the review instead of modifying it.'
      );
  }
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Errors: errors.array() });
  }
  const newReview = {
    email: `${userEmail}`,
    school: req.body.school,
    course_code: req.body.code.toUpperCase(),
    grade: req.body.grade,
    tags: req.body.tags,
    review: req.body.review,
    verified: false
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('users_reviews')
    .replaceOne({ course_code: req.params.code, email: `${userEmail}` }, newReview);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to update your review.`);
  }
};

// use your oidc.email and pass the course code
const deleteReview = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request. Use the admin tools.');
  }
  const response = await mongodb
    .getDb()
    .db()
    .collection('users_reviews')
    .deleteOne({ course_code: req.params.code, email: `${userEmail}` }, true);

  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to delete your review.`);
  }
};

module.exports = {
  getAllVerifiedReviews,
  getAllUnverifiedReviews,
  getCurrentUserValidReviews,
  getCurrentUserInvalidReviews,
  getReviewsByCourseCode,
  getReviewsByEmail,
  createReview,
  updateReview,
  deleteReview
};
