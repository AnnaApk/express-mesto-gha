const NOT_FOUND = 404;
const NOT_VALID = 400;
const SERVER_ERR = 500;

const { ObjectId } = require('mongoose').Types;
const Card = require('../models/card');

module.exports.postCard = (req, res) => {
  const owner = req.user._id;
  const { name, link, createdAt } = req.body;

  Card.create({
    name, link, owner, createdAt,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID).send({ message: 'Данные карточки не верны!' });
        return;
      }
      res.status(SERVER_ERR).send({ message: err.message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(SERVER_ERR).send({ message: err.message }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (!ObjectId.isValid(req.params.cardId)) {
        res.status(NOT_VALID).send({ message: 'Данные не верны!' });
        return;
      }
      res.status(SERVER_ERR).send({ message: err.message });
    });
};

module.exports.addLike = (req, res) => {
  const user = req.user._id;
  const card = req.params.cardId;
  Card.findByIdAndUpdate(
    card,
    { $addToSet: { likes: user } },
    { new: true },
  )
    .then(() => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (!ObjectId.isValid(req.params.cardId)) {
        res.status(NOT_VALID).send({ message: 'Данные не верны!' });
        return;
      }
      res.status(SERVER_ERR).send({ message: err.message });
    });
};

module.exports.deleteLike = (req, res) => {
  const user = req.user._id;
  const card = req.params.cardId;
  Card.findByIdAndUpdate(
    card,
    { $pull: { likes: user } },
    { new: true },
  )
    .then(() => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена!' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (!ObjectId.isValid(req.params.cardId)) {
        res.status(NOT_VALID).send({ message: 'Данные не верны!' });
        return;
      }
      res.status(SERVER_ERR).send({ message: err.message });
    });
};
