const { isEmpty, isValidEmail } = require('./helper');
const { validatorMessage } = require('./constants');

module.exports = {
  registerValidator: credentials => {
    const { username, email, password, confirmPassword } = credentials;
    const errors = {};

    if (isEmpty(username)) {
      errors.username = validatorMessage.REQUIRE_EXISTS;
    }

    if (isEmpty(email)) {
      errors.email = validatorMessage.REQUIRE_EXISTS;
    } else if (!isValidEmail(email)) {
      errors.email = validatorMessage.REQUIRE_VALID_EMAIL;
    }

    if (isEmpty(password)) {
      errors.password = validatorMessage.REQUIRE_EXISTS;
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = validatorMessage.REQUIRE_MATCH;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
  loginValidator: credentials => {
    const { username, password } = credentials;
    const errors = {};

    if (isEmpty(username)) {
      errors.username = validatorMessage.REQUIRE_EXISTS;
    }

    if (isEmpty(password)) {
      errors.password = validatorMessage.REQUIRE_EXISTS;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
  sendMessageValidator: ({ content }) => {
    let errors = {};

    if (isEmpty(content)) {
      errors.content = validatorMessage.REQUIRE_EXISTS;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
