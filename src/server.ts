import * as dotenv from 'dotenv';
import { connectToDatabase, collections } from './db.js';
import Customer from './customer.model.js';
import { makeRandomRecordsArray } from './helpers.js';
dotenv.config();

async function addCustomersCallback() {
  const newCustomers = makeRandomRecordsArray(Math.random() * 10);
  const data = await collections.Customers?.insertMany(newCustomers);
  console.log(`Inserted ${data?.insertedCount} new customers`);
}

async function syncDevCustomersCallback() {
  const lastAnonymizedCustomer: Customer = (await collections.CustomersAnonymised?.findOne(
    {},
    { sort: { _id: -1 } },
  )) as Customer;

  const newCustomers: Customer[] = (await collections.Customers?.find(
    lastAnonymizedCustomer?._id ? { _id: { $gt: lastAnonymizedCustomer._id } } : {},
  ).toArray()) as Customer[];

  if (newCustomers.length === 0) return;

  const anonymizedCustomers: Customer[] = newCustomers.map((el) =>
    Object.assign(new Customer(), el).getAnonymizedData(),
  ) as Customer[];

  const data = await collections.CustomersAnonymised?.insertMany(anonymizedCustomers);
  console.log(`Inserted ${data?.insertedCount} new anonymized customers`);
}

async function server() {
  await connectToDatabase();
  setInterval(addCustomersCallback, 200);
  setInterval(syncDevCustomersCallback, 200);
}

server().then();
