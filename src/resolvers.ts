import { collections } from './db.js';
import Customer from './customer.model.js';
import { ObjectId } from 'mongodb';

const getAllCustomers = async () => (await collections.CustomersAnonymised?.find({}).toArray()) as Customer[];
const getCustomerById = async (id: string) =>
  (await collections.CustomersAnonymised?.findOne({ _id: new ObjectId(id) })) as Customer;

export const root = {
  getAllCustomers,
  getCustomerById,
};
