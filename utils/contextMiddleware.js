const jwt = require('jsonwebtoken');

module.exports = context => {
  const jwtSecret = process.env.jwtSecret;
  const authHeader = context.req.headers.authorization;

  try {
    if (authHeader) {
      const token = authHeader.split('Bearer ')[1];
      if (token) {
        const decodedToken = jwt.verify(token, jwtSecret);

        context.user = decodedToken;
      }
    }

    return context;
  } catch (err) {
    context.user = null;

    return context;
  }
};
