require('dotenv').config();
const { ApolloServer } = require('apollo-server');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const connectDB = require('./utils/db');
const contextMiddleware = require('./utils/contextMiddleware');

const PORT = process.env.PORT || 5000;
const INTROSPECTION = process.env.GRAPHQL_INTROSPECTION_ENABLED;
const PLAYGROUND = process.env.GRAPHQL_PLAYGROUND_ENABLED;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  introspection: INTROSPECTION,
  playground: PLAYGROUND,
});

server
  .listen({ port: PORT })
  .then(({ url }) => {
    console.log(`Server is running at ${url}`);
    return connectDB();
  })
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch(err => {
    console.log(err);
  });
