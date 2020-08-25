const jwt = require('jsonwebtoken');

module.exports = {
  isEmpty: string => string.trim() === '',
  isValidEmail: email => {
    const regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    return regEx.test(email);
  },
  isValidPhone: phone => {
    const regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    return regEx.test(phone);
  },
  generateToken: data => {
    const jwtSecret = process.env.jwtSecret;
    return jwt.sign(data, jwtSecret, { expiresIn: '1h' });
  },
  timestampHelper: {
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
