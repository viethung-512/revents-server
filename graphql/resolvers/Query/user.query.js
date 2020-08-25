const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');

const User = require('../../../models/User');
const { loginValidator } = require('../../../utils/validators');
const { generateToken } = require('../../../utils/helper');

module.exports = {
  getUsers: async (parent, args, { user }, info) => {
    if (!user) {
      throw new AuthenticationError('Unauthenticated');
    }

    const users = await User.find({
      username: { $ne: user.username },
    })
      .select('-createdAt')
      .sort({ createdAt: -1 });

    return users;
  },
  login: async (parent, args, context, info) => {
    const { username, password } = args;

    try {
      const { valid, errors } = loginValidator(args);

      if (!valid) {
        throw new UserInputError('Bad Request', { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new AuthenticationError('User not found', { errors });
      }
      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) {
        errors.general = 'Password is incorrect';
        throw new AuthenticationError('Password is incorrect', { errors });
      }

      const token = generateToken({ userId: user.id, username });
      user.token = token;

      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
