/*
Notes:
  > Only admis should have access to these requests
*/
const admin = require('../validation/admin');
const mongodb = require('../database/connect');
const ObjectId = require('mongodb').ObjectId;

/**************************
 * To get all school:     *
 *    Takes no params     *
 **************************/
const getAll = async (req, res) => {
  try {
    const data = await mongodb.getDb().db().collection('schools').find();
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*************************
 * To get one school:    *
 *    Takes an id        *
 *************************/
const getSingle = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID');
  } else {
    const schoolId = new ObjectId(req.params.id);
    mongodb
      .getDb()
      .db()
      .collection('schools')
      .find({ _id: schoolId })
      .toArray((err, result) => {
        if (result.length === 0) {
          res.status(404).json(`No schools found under ID: ${schoolId}`);
        } else if (err) {
          res.status(400).json({ message: err });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(result);
        }
      });
  }
};

/******************************
 * To create a new school:    *
 *    Takes no params - ADMIN *
 ******************************/
const createNewSchool = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  const newSchool = {
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
    description: req.body.description
  };
  const response = await mongodb.getDb().db().collection('schools').insertOne(newSchool);
  console.log(response);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || `Something went wrong while attempting to add a school.`);
  }
};

/*************************
 * To edit a school:     *
 *    Takes an ID - ADMIN*
 *************************/
const editSchool = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID');
  } else {
    const schoolId = new ObjectId(req.params.id);
    const newSchool = {
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      description: req.body.description
    };
    const response = await mongodb
      .getDb()
      .db()
      .collection('schools')
      .replaceOne({ _id: schoolId }, newSchool);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || `Something went wrong while attempting to update a school`);
    }
  }
};

/**************************
 * To delete a school:    *
 *    Takes an ID - ADMIN *
 **************************/
const deleteSchool = async (req, res) => {
  const userEmail = req.oidc.user.email;
  const isAdmin = await admin.isAdmin(userEmail);
  if (!isAdmin) {
    return res.status(400).json('Bad Request');
  }
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must pass a valid ID');
  } else {
    const schoolId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('schools')
      .deleteOne({ _id: schoolId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || `Something went wrong while attempting to delete a school`);
    }
  }
};

module.exports = {
  getAll,
  getSingle,
  createNewSchool,
  editSchool,
  deleteSchool
};
