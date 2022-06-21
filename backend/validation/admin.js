const mongodb = require('../database/connect');

/*********************************************************
 * Utility, returns bool, checks if an email is an admin *
 *********************************************************/
const isAdmin = async (email) => {
  const data = await mongodb.getDb().db().collection('admin').find();
  const list = await data.toArray();
  let valid = false;
  list.forEach((item) => {
    if (email === item.email) {
      valid = true;
    }
  });
  return valid;
};

/*******************************************************
 * Utility, returns bool, checks if an email is banned *
 *******************************************************/
const isBanned = async (email) => {
  const data = await mongodb.getDb().db().collection('users_banned').find();
  const list = await data.toArray();
  let banned = false;
  list.forEach((item) => {
    if (email === item.email) {
      banned = true;
    }
  });
  return banned;
};

/*************************************************************
 * Utility, returns bool, checks if user data already exists *
 *************************************************************/
const dataExists = async (email) => {
  const data = await mongodb.getDb().db().collection('users_data').find();
  const list = await data.toArray();
  let exists = false;
  list.forEach((item) => {
    if (email === item.school_email) {
      exists = true;
    }
  });
  return exists;
};

/*************************************************************************
 * Utility, returns bool, checks if a review for a course already exists *
 *************************************************************************/
const reviewExists = async (email, code) => {
  const data = await mongodb.getDb().db().collection('users_reviews').find();
  const list = await data.toArray();
  let exists = false;
  list.forEach((item) => {
    if (code === item.course_code) {
      if (email === item.email) {
        exists = true;
      }
    }
  });
  return exists;
};

/********************************************************************
 * Utility, returns bool, checks if a invalid course already exists *
 ********************************************************************/
const courseInvalidExists = async (code) => {
  const data = await mongodb.getDb().db().collection('courses_unverified').find();
  const list = await data.toArray();
  let exists = false;
  list.forEach((item) => {
    if (code === item.code) {
      exists = true;
    }
  });
  return exists;
};

/******************************************************************
 * Utility, returns bool, checks if a valid course already exists *
 ******************************************************************/
courseValidExists = async (code) => {
  const data = await mongodb.getDb().db().collection('courses').find();
  const list = await data.toArray();
  let exists = false;
  list.forEach((item) => {
    if (code === item.code) {
      exists = true;
    }
  });
  return exists;
};

module.exports = {
  isAdmin,
  isBanned,
  dataExists,
  reviewExists,
  courseInvalidExists,
  courseValidExists
};
