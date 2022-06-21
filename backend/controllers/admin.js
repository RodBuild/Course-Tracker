/* 
    - view unverified users
    - view unverified reviews (Tracker)
    - View banned user
    - ban user
    - delete all entries by banned user.
*/
/*** Most of this will pass an email param */
const admin = require('../validation/admin');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

/***********************************
 * To get all unverified users:    *
 *    Takes no params              *
 ***********************************/
const getAllUnverifiedUsers = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  const data = await mongodb.getDb().db().collection('users_data').find({ verified: 'false' });
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

// essentially modify the verify entry, only that
/*******************************
 * To verify a single user:    *
 *    Takes an email           *
 *******************************/
const verifyUser = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  const response = await mongodb
    .getDb()
    .db()
    .collection('users_data')
    .updateOne({ school_email: req.params.email }, { $set: { verified: 'true' } });
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(403).json(response.error || `User is already marked as verified or does not exist`);
  }
};

/*********************************
 * To get all verified users:    *
 *    Takes no params            *
 *********************************/
const getAllVerifiedUsers = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  const data = await mongodb.getDb().db().collection('users_data').find({ verified: 'true' });
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

// verify a single entry.
/*********************************
 * To verify a single review:    *
 *    Takes an id                *
 *********************************/
const verifyReview = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must pass a valid ID');
  }
  const reviewId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection('users_reviews')
    .updateOne({ _id: reviewId }, { $set: { verified: 'true' } });
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(403)
      .json(response.error || `Review is already marked as verified or does not exist`);
  }
};

// // delete all data from this user! (reference shall be email)
// const banVerifiedUser = async (req, res) => {
//   const userEmail = req.oidc.user.email;
//   const isAdmin = await admin.isAdmin(userEmail);
//   if (!isAdmin) {
//     return res.status(400).json('Bad Request');
//   }
// };

// delete a review by its ID
const removeReview = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json('Must pass a valid ID');
  }
  const reviewId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection('users_reviews')
    .deleteOne({ _id: reviewId }, true);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(403).json(response.error || `Review could not be found`);
  }
};

// Verify course?? - Wouldn't it be better to do it by hand???
const verifyCourse = async (req, res) => {
  //take an id,
  //look into unverified courses
  // mathc with id and copy contents into a new dictionary object
  //insert new dict object into courses
  // return some response
};

//
// const

/*****************************
 * To get all ban a user:    *
 *    Takes an email,        *
 *    removes all data       *
 *    related to the user,   *
 *    still need to ban on   *
 *    Auht0.com              *
 *****************************/
const banUser = async (req, res) => {
  const emailToBan = req.params.email;
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  const isBanned = await admin.isBanned(emailToBan);
  if (isBanned) {
    return res.status(409).json('User is already banned');
  }
  const newBan = {
    email: `${emailToBan}`,
    reason: req.body.reason
  };
  const response = await mongodb.getDb().db().collection('users_banned').insertOne(newBan);
  if (response.acknowledged) {
    try {
      let courses = false,
        reviews = false,
        data = false;
      /* TIME to DELETE related data */
      // Created unverified courses First
      let response = await mongodb
        .getDb()
        .db()
        .collection('courses_unverified')
        .deleteMany({ author: emailToBan });
      courses = response.acknowledged;

      // Created reviews Second
      //   response = await mongodb.getDb().db().collection('reviews').deleteMany({ email: emailToBan });
      reviews = response.acknowledged;

      // Created user data Third
      response = await mongodb
        .getDb()
        .db()
        .collection('users_data')
        .deleteMany({ school_email: emailToBan });
      data = response.acknowledged;
      if (courses === true && reviews === true && data === true) {
        return res.status(200).json(`Courses: ${courses}, Reviews: ${reviews}, Data: ${data}`);
      } else {
        return res.status(409).json(`Courses: ${courses}, Reviews: ${reviews}, Data: ${data}`);
      }
      /******************************/
    } catch (error) {
      res
        .status(500)
        .json(response.error || `Something went wrong while attempting to remove the related data`);
    }
  } else {
    res
      .status(500)
      .json(
        response.error ||
          `Something went wrong while attempting to ban user with email ${emailToBan}`
      );
  }
};

module.exports = {
  getAllUnverifiedUsers,
  getAllVerifiedUsers,
  verifyUser,
  verifyReview,
  removeReview,
  banUser
};
