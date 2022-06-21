const admin = require('../validation/admin');
const mongodb = require('../database/connect');

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
  const data = await mongodb.getDb().db().collection('users_reviews').find({ verified: 'false'});
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

// TODO: POST, PUT, DELETE - LATER

module.exports = {
  getAllVerifiedReviews,
  getAllUnverifiedReviews,
  getCurrentUserValidReviews,
  getCurrentUserInvalidReviews
};
