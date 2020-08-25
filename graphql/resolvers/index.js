const queryResolvers = require('./Query');
const mutationResolvers = require('./Mutation');
const messageResolvers = require('./Message');

module.exports = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Message: messageResolvers,
};
