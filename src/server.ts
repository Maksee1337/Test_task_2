import * as dotenv from 'dotenv';
import { connectToDatabase } from './db.js';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema.js';
import { root } from './resolvers.js';
import { addCustomersCallback, syncDevCustomersCallback } from './callbacks.js';
dotenv.config();

const PORT = 4000;
const app = express();
app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));

async function server() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Add random customers to the database every 200ms
    setInterval(addCustomersCallback, 200);

    // Synchronize the Customers collection with the CustomersAnonymised collection every 200ms
    setInterval(syncDevCustomersCallback, 200);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (e) {
    console.error('Server error', e);
  }
}

server().then();
