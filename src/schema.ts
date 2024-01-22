import { buildSchema } from 'graphql';

const schema = buildSchema(`
    type Customer {
        _id: ID
        firstName: String
        lastName: String
        email: String
        createdAt: String
        address: Address
    }
    type Address {
      line1: String
      line2: String
      postCode: String
      city: String
      state: String
      country: String
    }
    type Query {
        getAllCustomers: [Customer]
        getCustomerById(id: ID): Customer
    }
 `);
export default schema;
