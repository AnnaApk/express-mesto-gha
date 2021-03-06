const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const helmet = require('helmet');
const process = require('process');
const { celebrate, Joi, errors } = require('celebrate');

const NotFoundError = require('./errors/notFoundError');
const { isAuthorized } = require('./middlewares/auth');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/[a-z0-9\D]*\.{1}[a-z0-9\D]*/),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(isAuthorized);
app.use('/', userRoute);
app.use('/', cardRoute);

app.use((req, res, next) => {
  const err = new NotFoundError('Route is not defauned!');
  next(err);
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  console.log(err.stack);
  return res.status(500).send({ message: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
