// call dotenv and setup config()
const dotenv = require('dotenv');
dotenv.config();

// connect to mongodb
const MongoClient = require('mongodb').MongoClient;

// create _db variable
let _db;

// to be called, initialize connection to db
const initDb = (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

// recover connection to db
const getDb = () => {
  if (!_db) {
    throw new Error('Db not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb
};
