const userMutation = require('./user.mutation');
const messageMutation = require('./message.mutation');

module.exports = {
  ...userMutation,
  ...messageMutation,
};
