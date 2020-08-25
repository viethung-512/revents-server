const { AuthenticationError, UserInputError } = require('apollo-server');
const Message = require('../../../models/Message');
const User = require('../../../models/User');

module.exports = {
  getMessages: async (parent, { from }, { user }, info) => {
    try {
      if (!user) throw new AuthenticationError('Unauthenticated.');

      const contact = await User.findOne({ username: from });

      if (!contact) throw new UserInputError('Contact not found.');

      const usernames = [user.username, contact.username];

      const messages = await Message.find({
        from: { $in: usernames },
        to: { $in: usernames },
      }).sort({
        createdAt: -1,
      });

      return messages;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
