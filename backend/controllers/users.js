const admin = require('../validation/admin');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;
const { validationResult } = require('express-validator');

/************************************
 * To get logged in user's data:    *
 *    Takes no params - NO Admins   *
 ************************************/
const getUserData = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  try {
    mongodb
      .getDb()
      .db()
      .collection('users_data')
      .find({ school_email: userEmail })
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
 * To another user's data:    *
 *    Takes an email          *
 ******************************/
const getAnotherUserDataByEmail = async (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection('users_data')
      .find({ school_email: req.params.email.toLowerCase() })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.setHeader('Content-Type', 'application/json');
          res.status(404).json('No data was found');
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

/*****************************************
 * To create data for logged in user:    *
 *    Takes no params - NO Admins        *
 *****************************************/
const createUserData = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  const dataExists = await admin.dataExists(userEmail);
  if (dataExists) {
    return res.status(400).json('User data already exists.');
  }
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Errors: errors.array() });
  }
  const newData = {
    fname: req.body.fname,
    lname: req.body.lname,
    major: req.body.major,
    school: req.body.school,
    school_email: `${userEmail}`,
    school_id: req.body.school_id,
    verified: false,
    isAdmin: false
  };
  const response = await mongodb.getDb().db().collection('users_data').insertOne(newData);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to add new data.`);
  }
};

/***************************************
 * To update logged in user's data:    *
 *    Takes no params - NO Admins      *
 ***************************************/
const updateUserData = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (isAdmin) {
    return res.status(400).json('Administrator cannot run this request.');
  }
  const errors = validationResult(req, res);
  if (!errors.isEmpty()) {
    return res.status(400).json({ Errors: errors.array() });
  }
  const newData = {
    fname: req.body.fname,
    lname: req.body.lname,
    major: req.body.major,
    school: req.body.school,
    school_email: `${userEmail}`,
    school_id: req.body.school_id,
    verified: false,
    isAdmin: false
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('users_data')
    .replaceOne({ school_email: userEmail }, newData);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to update the user data`);
  }
};

/***************************************
 * To update logged in user's data:    *
 *    Takes an ID - ONLY admins        *
 ***************************************/
const deleteUserData = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID');
  } else {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('users_data')
      .deleteOne({ _id: userId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || `Something went wrong while attempting to delete the user data`);
    }
  }
};

module.exports = {
  getUserData,
  getAnotherUserDataByEmail,
  createUserData,
  updateUserData,
  deleteUserData
};
