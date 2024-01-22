import { makeRandomRecordsArray } from './helpers.js';
import { collections } from './db.js';
import Customer from './customer.model.js';

/**
 * Callback for adding random customers to the database
 */
export async function addCustomersCallback() {
  // Generate random customers
  const newCustomers = makeRandomRecordsArray(Math.random() * 10);

  // Insert new customers into the Customers collection
  const data = await collections.Customers?.insertMany(newCustomers);
  console.log(`Inserted ${data?.insertedCount} new customers`);
}

/**
 * Callback for synchronizing the Customers collection with the CustomersAnonymised collection
 */
export async function syncDevCustomersCallback() {
  // Get the last anonymized customer
  const lastAnonymizedCustomer: Customer = (await collections.CustomersAnonymised?.findOne(
    {},
    { sort: { _id: -1 } },
  )) as Customer;

  // Get all new customers
  const newCustomers: Customer[] = (await collections.Customers?.find(
    lastAnonymizedCustomer?._id ? { _id: { $gt: lastAnonymizedCustomer._id } } : {},
  ).toArray()) as Customer[];

  if (newCustomers.length === 0) return;

  // Anonymize new customers
  const anonymizedCustomers: Customer[] = newCustomers.map((el) =>
    Object.assign(new Customer(), el).getAnonymizedData(),
  ) as Customer[];

  // Insert anonymized customers into the CustomersAnonymised collection
  const data = await collections.CustomersAnonymised?.insertMany(anonymizedCustomers);
  console.log(`Inserted ${data?.insertedCount} new anonymized customers`);
}
