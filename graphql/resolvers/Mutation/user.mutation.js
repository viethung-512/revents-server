const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} = require('apollo-server');
const bcrypt = require('bcrypt');

const User = require('../../../models/User');
const { registerValidator } = require('../../../utils/validators');
const { generateToken } = require('../../../utils/helper');

module.exports = {
  register: async (parent, args, context, info) => {
    const { username, email, password } = args;

    try {
      // Validate input
      const { valid, errors } = registerValidator(args);
      if (!valid) {
        throw errors;
      }

      // Check username / email exists
      const usernameExists = await User.exists({ username });
      const emailExists = await User.exists({ email });

      if (usernameExists) errors.username = 'Username is already taken';
      if (emailExists) errors.email = 'Email is already taken';

      if (Object.keys(errors).length > 0) {
        throw errors;
      }

      // TODO: Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await user.save();
      const token = generateToken({ userId: user.id, username: user.username });
      user.token = token;

      return user;
    } catch (err) {
      console.log(err);
      throw new UserInputError('Bad Input', { errors: err });
    }
  },
  updateUser: async (
    parent,
    { username, description, password },
    { user: authUser },
    info
  ) => {
    const updateUserInfo = {};
    if (!authUser) {
      throw new ForbiddenError('You can not access this source.');
    }

    try {
      const user = await User.findById(authUser.userId);

      if (!user) {
        throw new ApolloError('User not found');
      }

      if (username && username !== authUser.username) {
        const usernameExists = await User.exists({ username });
        if (usernameExists) {
          throw ApolloError('User name already taken');
        }

        updateUserInfo.username = username;
      }

      if (password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        updateUserInfo.password = hashedPassword;
      }

      if (description) {
        updateUserInfo.description = description;
      }

      const updatedUser = await User.findByIdAndUpdate(
        authUser.userId,
        updateUserInfo,
        { new: true }
      );

      return updatedUser;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new ApolloError('User not found');
      }

      throw err;
    }
  },
  toggleFollowUser: async (parent, { userId }, { user: authUser }, info) => {
    if (!authUser) {
      throw ForbiddenError('You can not access this source');
    }

    if (userId === authUser.id) {
      throw new ApolloError('You can not follow yourself');
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApolloError('User not found');
      }

      const userFollowed = user.followers.some(
        userFollow => userFollow.toString() === authUser.id
      );

      if (userFollowed) {
        user.followers = user.followers.filter(
          userFollower => userFollower.toString() !== authUser.id
        );
      } else {
        user.followers.push(authUser.id);
      }

      const updatedUser = await User.findByIdAndUpdate(userId, user)
        .populate('host', ['id', 'username', 'photoURL'], 'User')
        .populate('attendees', ['id', 'username', 'photoURL'], 'User');

      return updatedUser;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new ApolloError('User not found');
      }
      throw err;
    }
  },
};
