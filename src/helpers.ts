import Customer, { ICustomer } from './customer.model.js';

/**
 * Generates an array of random customers
 */
export function makeRandomRecordsArray(quantity: number): ICustomer[] {
  const records: ICustomer[] = [];
  for (let i = 0; i < quantity; i++) {
    records.push(new Customer());
  }
  return records;
}

/**
 * Generates a random string
 */
export function generateRandomString(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
