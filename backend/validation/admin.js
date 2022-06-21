const mongodb = require('../database/connect');

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

const dataExists = async (email) => {
  const data = await mongodb.getDb().db().collection('users_data').find();
  const list = await data.toArray();
  let exists = false;
  list.forEach((item) => {
    if (email === item.email) {
      exists = true;
    }
  });
  return exists;
};

module.exports = {
  isAdmin,
  isBanned,
  dataExists
};
