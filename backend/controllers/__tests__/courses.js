const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

/********* courses ************
 * Test the CRUD requests to  *
 * a mongodb collection       *
 ******************************/
// POSTING TO DATABASE
describe('Create', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db('course_tracker');
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should insert a doc into collection', async () => {
    const test_collection = db.collection('test_all_collections');

    // delete any existing data
    await test_collection.deleteMany({ _id: 'ccourse-id' });

    const mockCourse = {
      _id: 'ccourse-id',
      test_type: 'courses',
      data: 'Programming with functions'
    };
    await test_collection.insertOne(mockCourse);

    const insertedCourse = await test_collection.findOne({ _id: 'ccourse-id' });
    expect(insertedCourse).toEqual(mockCourse);
  });
});

// GETTING FROM A DATABASE
describe('Read', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db('course_tracker');
  });

  afterAll(async () => {
    await connection.close();
  });
  it('should read a doc from collection', async () => {
    const test_collection = db.collection('test_all_collections');

    // delete any existing data
    await test_collection.deleteMany({ _id: 'rcourse-id' });

    const mockCourse = {
      _id: 'rcourse-id',
      test_type: 'courses',
      data: 'Programming with functions'
    };
    await test_collection.insertOne(mockCourse);

    const insertedCourse = await test_collection.findOne({ _id: 'rcourse-id' });
    expect(insertedCourse).toEqual(mockCourse);
  });
});

// UPDATING A DATABASE
describe('Update', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db('course_tracker');
  });

  afterAll(async () => {
    await connection.close();
  });
  it('should update a doc from collection', async () => {
    const test_collection = db.collection('test_all_collections');

    // delete any existing data
    await test_collection.deleteMany({ _id: 'ucourse-id' });

    const mockCourse = {
      _id: 'ucourse-id',
      test_type: 'courses',
      data: 'Programming with functions'
    };
    await test_collection.insertOne(mockCourse);

    const insertedCourse = await test_collection.replaceOne({ _id: 'ucourse-id' }, mockCourse);
    expect(insertedCourse.acknowledged).toEqual(true);
  });
});

// REMOVING FROM A DATABASE
describe('Delete', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db('course_tracker');
  });

  afterAll(async () => {
    await connection.close();
  });
  it('should delete a doc from collection', async () => {
    const test_collection = db.collection('test_all_collections');

    // delete any existing data
    await test_collection.deleteMany({ _id: 'dcourse-id' });

    const mockCourse = {
      _id: 'dcourse-id',
      test_type: 'courses',
      data: 'Programming with functions'
    };
    await test_collection.insertOne(mockCourse);

    const insertedCourse = await test_collection.deleteOne({ _id: 'dcourse-id' });
    expect(insertedCourse.acknowledged).toEqual(true);
  });
});
