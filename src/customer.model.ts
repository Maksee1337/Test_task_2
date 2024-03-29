import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';
import { generateRandomString } from './helpers.js';

interface IAddress {
  _id?: ObjectId;
  line1: string;
  line2?: string;
  postCode: string;
  city: string;
  state: string;
  country: string;
}

export interface ICustomer {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  address: IAddress;
  createdAt?: Date;
}

export default class Customer implements ICustomer {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  createdAt: Date;
  email: string;
  address: IAddress;

  /**
   * Creates a new Customer with random data
   */
  constructor() {
    this._id = new ObjectId();
    this.firstName = faker.person.firstName();
    this.lastName = faker.person.lastName();
    this.createdAt = new Date();
    this.email = faker.internet.email();
    this.address = {
      line1: faker.location.streetAddress(),
      line2: faker.location.secondaryAddress(),
      postCode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: 'US',
    };
  }

  /**
   * Returns anonymised customer data
   */
  public getAnonymisedData(): ICustomer {
    return {
      ...this,
      firstName: generateRandomString(),
      lastName: generateRandomString(),
      email: generateRandomString() + this.email.substring(this.email.indexOf('@')),
      address: {
        ...this.address,
        line1: generateRandomString(),
        line2: generateRandomString(),
        postCode: generateRandomString(),
      },
    };
  }
}
