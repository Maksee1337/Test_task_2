import * as mongoDB from 'mongodb';

export const collections: { Customers?: mongoDB.Collection; CustomersAnonymised?: mongoDB.Collection } = {};
export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(<string>process.env.DB_URI);
  await client.connect();
  const db: mongoDB.Db = client.db('shop');

  const customersCollection: mongoDB.Collection = db.collection('customers');
  const customersAnonymisedCollection: mongoDB.Collection = db.collection('customersAnonymised');

  collections.Customers = customersCollection;
  collections.CustomersAnonymised = customersAnonymisedCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName}. Collections: ${Object.keys(collections).join(', ')}`
  );
}
