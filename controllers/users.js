const NOT_FOUND = 404;
const NOT_VALID = 400;
const SERVER_ERR = 500;

const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID).send({ message: 'Данные пользователя не верны!' });
        return;
      }
      res.status(SERVER_ERR).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(SERVER_ERR).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(NOT_VALID).send({ message: 'Данные пользователя не верны!' });
        return;
      }
      res.status(SERVER_ERR).send({ message: err.message });
    });
};

module.exports.patchUser = (req, res) => {
  const user = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    user,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((patchedUser) => {
      if (!patchedUser) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.send(patchedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID).send({ message: 'Данные пользователя не верны!' });
        return;
      }
      res.status(SERVER_ERR).send({ message: err.message });
    });
};

module.exports.patchUserAvatar = (req, res) => {
  const user = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    user,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((patchedUser) => {
      if (!patchedUser) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден!' });
        return;
      }
      res.send(patchedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID).send({ message: 'Данные пользователя не верны!' });
        return;
      }
      res.status(SERVER_ERR).send({ message: err.message });
    });
};
