const { UserInputError } = require('apollo-server');
const bcrypt = require('bcrypt');

const User = require('../../../models/User');
const { registerValidator } = require('../../../utils/validators');

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

      return user;
    } catch (err) {
      console.log(err);
      throw new UserInputError('Bad Input', { errors: err });
    }
  },
};
