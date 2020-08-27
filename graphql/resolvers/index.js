const queryResolvers = require('./Query');
const mutationResolvers = require('./Mutation');
const eventResolvers = require('./Event');

module.exports = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Event: eventResolvers,
};
