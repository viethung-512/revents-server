const userQuery = require('./user.query');
const eventQuery = require('./event.query');

module.exports = {
  ...userQuery,
  ...eventQuery,
};
