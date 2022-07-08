const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

/********* schools ************
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
    await test_collection.deleteMany({ _id: 'cschool-id' });

    const mockSchool = {
      _id: 'cschool-id',
      test_type: 'schools',
      data: 'Brigham Young University - Idahoo'
    };
    await test_collection.insertOne(mockSchool);

    const insertedSchool = await test_collection.findOne({ _id: 'cschool-id' });
    expect(insertedSchool).toEqual(mockSchool);
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
    await test_collection.deleteMany({ _id: 'rschool-id' });

    const mockSchool = {
      _id: 'rschool-id',
      test_type: 'schools',
      data: 'Brigham Young University - Idahoo'
    };
    await test_collection.insertOne(mockSchool);

    const insertedSchool = await test_collection.findOne({ _id: 'rschool-id' });
    expect(insertedSchool).toEqual(mockSchool);
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
    await test_collection.deleteMany({ _id: 'uschool-id' });

    const mockSchool = {
      _id: 'uschool-id',
      test_type: 'schools',
      data: 'Brigham Young University - Idahoo'
    };
    await test_collection.insertOne(mockSchool);

    const insertedSchool = await test_collection.replaceOne({ _id: 'uschool-id' }, mockSchool);
    expect(insertedSchool.acknowledged).toEqual(true);
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
    await test_collection.deleteMany({ _id: 'dschool-id' });

    const mockSchool = {
      _id: 'dschool-id',
      test_type: 'schools',
      data: 'Brigham Young University - Idahoo'
    };
    await test_collection.insertOne(mockSchool);

    const insertedSchool = await test_collection.deleteOne({ _id: 'dschool-id' });
    expect(insertedSchool.acknowledged).toEqual(true);
  });
});

// function filterByTerm(inputArr, searchTerm) {
//   const regex = new RegExp(searchTerm, 'i');
//   return inputArr.filter(function (arrayElement) {
//     return arrayElement.url.match(regex);
//   });
// }

// describe('Filter function', () => {
//   test('it should filter by a search term (link)', () => {
//     const input = [
//       { id: 1, url: 'https://www.url1.dev' },
//       { id: 2, url: 'https://www.url2.dev' },
//       { id: 3, url: 'https://www.link3.dev' }
//     ];

//     const output = [{ id: 3, url: 'https://www.link3.dev' }];

//     expect(filterByTerm(input, 'link')).toEqual(output);

//     expect(filterByTerm(input, 'LINK')).toEqual(output);
//   });
// });
