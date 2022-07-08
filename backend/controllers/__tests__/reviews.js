const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

/********* reviews ************
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
    await test_collection.deleteMany({ _id: 'creview-id' });

    const mockReview = {
      _id: 'creview-id',
      test_type: 'reviews',
      data: 'Programming with functions'
    };
    await test_collection.insertOne(mockReview);

    const insertedCourse = await test_collection.findOne({ _id: 'creview-id' });
    expect(insertedCourse).toEqual(mockReview);
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
    await test_collection.deleteMany({ _id: 'rreview-id' });

    const mockReview = {
      _id: 'rreview-id',
      test_type: 'reviews',
      data: 'Programming with functions'
    };
    await test_collection.insertOne(mockReview);

    const insertedCourse = await test_collection.findOne({ _id: 'rreview-id' });
    expect(insertedCourse).toEqual(mockReview);
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
    await test_collection.deleteMany({ _id: 'ureview-id' });

    const mockReview = {
      _id: 'ureview-id',
      test_type: 'reviews',
      data: 'Programming with functions'
    };
    await test_collection.insertOne(mockReview);

    const insertedCourse = await test_collection.replaceOne({ _id: 'ureview-id' }, mockReview);
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
    await test_collection.deleteMany({ _id: 'dreview-id' });

    const mockReview = {
      _id: 'dreview-id',
      test_type: 'reviews',
      data: 'Programming with functions'
    };
    await test_collection.insertOne(mockReview);

    const insertedCourse = await test_collection.deleteOne({ _id: 'dreview-id' });
    expect(insertedCourse.acknowledged).toEqual(true);
  });
});
