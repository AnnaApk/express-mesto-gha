const SECRET_KEY = 'very_secret';
const SOLT = 10;

const { ObjectId } = require('mongoose').Types;
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotValidError, ConflictError, NotFoundError } = require('../errors/errors');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new NotValidError('Заполните обязательные поля!');
  }
  bcryptjs
    .hash(password, SOLT)
    .then((hash) => {
      User
        .create({
        name, about, avatar, email, password: hash,
        })
        .then((user) => res.status(200).send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            console.log(err.name, err.stack)
            throw new NotValidError('Данные пользователя не верны!');
          }
          if (err.code === 11000) {
            throw new ConflictError('Email уже зарегистрирован!');
          }
        })
        .catch(next)
    })
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new NotFoundError('Данные не верны!');
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Данные не верны!2');
      }
      return Promise.all([
        user,
        bcryptjs.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        throw new NotFoundError('Данные не верны!3');
      }
      return jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
    })
    .then((token) => res.send({ token }))
    .catch(next);
};

module.exports.authorizedUser = (req, res) => {
  const { _id } = req.user._id;
  User.findOne({ _id })
    .then((user) => {
      res.send({ user });
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
//(err) => res.status(SERVER_ERR).send({ message: err.message })

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден!');
      }
      res.send(user);
    })
    .catch((err) => {
      if (!ObjectId.isValid(req.params.id)) {
        throw new NotValidError('Данные пользователя не верны!');
      }
      throw err;
    })
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const user = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    user,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((patchedUser) => {
      if (!patchedUser) {
        throw new NotFoundError('Пользователь не найден!');
      }
      res.send(patchedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError('Данные пользователя не верны!');
      }
      throw err;
    })
    .catch(next);
};

module.exports.patchUserAvatar = (req, res, next) => {
  const user = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    user,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((patchedUser) => {
      if (!patchedUser) {
        throw new NotFoundError('Пользователь не найден!');
      }
      res.send(patchedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotValidError('Данные пользователя не верны!');
      }
      throw err;
    })
    .catch(next);
};
