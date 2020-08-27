const userMutation = require('./user.mutation');
const eventMutation = require('./event.mutation');

module.exports = {
  ...userMutation,
  ...eventMutation,
};
