const queryResolvers = require('./Query');
const mutationResolvers = require('./Mutation');
const eventResolvers = require('./Event');
const userResolvers = require('./User');

module.exports = {
  Query: queryResolvers,
  Mutation: mutationResolvers,
  Event: eventResolvers,
  User: userResolvers,
};
