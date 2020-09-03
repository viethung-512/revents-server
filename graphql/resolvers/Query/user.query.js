const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} = require('apollo-server');
const bcrypt = require('bcrypt');

const User = require('../../../models/User');
const { loginValidator } = require('../../../utils/validators');
const { generateToken } = require('../../../utils/helper');

module.exports = {
  login: async (parent, args, context, info) => {
    const { email, password } = args;

    try {
      const { valid, errors } = loginValidator(args);

      if (!valid) {
        throw new UserInputError('Bad Request', { errors });
      }

      const user = await User.findOne({ email });
      if (!user) {
        errors.general = 'User not found';
        throw new AuthenticationError('User not found', { errors });
      }
      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) {
        errors.general = 'Password is incorrect';
        throw new AuthenticationError('Password is incorrect', { errors });
      }

      const token = generateToken({ userId: user.id, username: user.username });
      user.token = token;

      return user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getUser: async (parent, { id }, { user: authUser }, info) => {
    if (!authUser) {
      throw new ForbiddenError('You can not access this source');
    }

    try {
      const user = await User.findById(id)
        .select('-password')
        .populate('followers', ['id', 'username', 'photoURL'], 'User')
        .populate('followings', ['id', 'username', 'photoURL'], 'User');

      if (!user) {
        throw new ApolloError('User not found');
      }

      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new ApolloError('User not found');
      }

      throw error;
    }
  },
  getMe: async (parent, args, { user: authUser }, info) => {
    if (!authUser) {
      throw new ForbiddenError('You can not access this source');
    }

    try {
      const user = await User.findById(authUser.userId).select('-password');

      if (!user) {
        throw new ApolloError('User not found');
      }

      return user;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new ApolloError('User not found');
      } else {
        throw error;
      }
    }
  },
};
