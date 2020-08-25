const { AuthenticationError, UserInputError } = require('apollo-server');

const Message = require('../../../models/Message');
const User = require('../../../models/User');
const { sendMessageValidator } = require('../../../utils/validators');

module.exports = {
  sendMessage: async (parent, { to, content }, { user }, info) => {
    try {
      if (!user) {
        throw new AuthenticationError('Unauthenticated.');
      }

      const recipient = await User.findOne({ username: to });

      if (!recipient) {
        throw new UserInputError('User not found');
      } else if (user.username === recipient.username) {
        throw new UserInputError('You can not message yourself.');
      }

      const { valid, errors } = sendMessageValidator({ content });
      if (!valid) {
        throw new UserInputError('Bad Input.', { errors });
      }

      const message = new Message({
        from: user.username,
        to,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await message.save();

      return message;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
