const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const helmet = require('helmet');
const process = require('process');
const { celebrate, Joi, errors } = require('celebrate');

const REGULAR = /^https?:\/\/[a-z0-9\D]*/gmi;

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
    avatar: Joi.string().uri({
      scheme: [REGULAR],
    }),
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
  res.status(404).send({ message: 'Route is not defauned!' });
  // const err = new Error('Route is not defauned!');
  // err.status = 404;
  next();
});

app.use(errors());

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
