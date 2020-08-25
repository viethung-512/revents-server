const userQuery = require('./user.query');
const messageQuery = require('./message.query');

module.exports = {
  ...userQuery,
  ...messageQuery,
};
