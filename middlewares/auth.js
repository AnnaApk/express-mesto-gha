const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = 'very_secret';

const throwUnauthorizedError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 401;
  throw error;
};

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    throwUnauthorizedError();
  }

  const token = auth.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, SECRET_KEY);

    User.findOne({ _id: payload._id })
      .select('+password')
      .then((user) => {

        if (!user) {
          throwUnauthorizedError();
        }

        req.user = { _id: user._id };

        next();
      });
  } catch (err) { throwUnauthorizedError(); }
};

module.exports = { isAuthorized };
