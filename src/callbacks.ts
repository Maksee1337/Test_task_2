import { makeRandomRecordsArray } from './helpers.js';
import { collections } from './db.js';
import Customer from './customer.model.js';

/**
 * Callback for adding random customers to the database
 */
export async function addCustomersCallback() {
  // Generate random customers
  const newCustomers = makeRandomRecordsArray(Math.random() * 10 + 1);

  // Insert new customers into the Customers collection
  const data = await collections.Customers?.insertMany(newCustomers);
  console.log(`Inserted ${data?.insertedCount} new customers`);
}

/**
 * Flag for preventing multiple synchronizations at the same time
 */
let isSyncing = false;

/**
 * Callback for synchronizing the Customers collection with the CustomersAnonymised collection
 */
export async function syncDevCustomersCallback() {
  // Prevent multiple synchronizations at the same time
  if (isSyncing) return;
  isSyncing = true;
  // Get the last anonymised customer
  const lastAnonymisedCustomer: Customer = (await collections.CustomersAnonymised?.findOne(
    {},
    { sort: { _id: -1 } },
  )) as Customer;

  // Get all new customers
  const newCustomers: Customer[] = (await collections.Customers?.find(
    lastAnonymisedCustomer?._id ? { _id: { $gt: lastAnonymisedCustomer._id } } : {},
  ).toArray()) as Customer[];

  if (newCustomers.length === 0) { isSyncing = false; return; }

  // Anonymise new customers
  const anonymisedCustomers: Customer[] = newCustomers.map((el) =>
    Object.assign(new Customer(), el).getAnonymisedData(),
  ) as Customer[];

  // Insert anonymised customers into the CustomersAnonymised collection
  const data = await collections.CustomersAnonymised?.insertMany(anonymisedCustomers);
  console.log(`Inserted ${data?.insertedCount} new anonymised customers`);

  isSyncing = false;
}
