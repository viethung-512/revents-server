const userMutation = require('./user.mutation');
const eventMutation = require('./event.mutation');
const fileMutation = require('./file.mutation');

module.exports = {
  ...userMutation,
  ...eventMutation,
  ...fileMutation,
};
