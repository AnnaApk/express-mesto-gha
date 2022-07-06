const { ObjectId } = require('mongoose').Types;
const { NotValidError, NotYoursError, NotSignUserError } = require('../errors/errors');
const Card = require('../models/card');

module.exports.postCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link, createdAt } = req.body;

  Card.create({
    name, link, owner, createdAt,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {;
        throw new NotValidError('Данные карточки не верны!')
      }
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {

  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotSignUserError('Карточка не найдена!');
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new NotYoursError('Карточка не Ваша!');
      }
      res.status(200).send(card);
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  const user = req.user._id;
  const card = req.params.cardId;
  Card.findByIdAndUpdate(
    card,
    { $addToSet: { likes: user } },
    { new: true },
  )
    .then((patchedCard) => {
      if (!patchedCard) {
        throw new NotSignUserError('Карточка не найдена!');
      }
      res.send(patchedCard);
    })
    .catch((err) => {
      if (!ObjectId.isValid(req.params.cardId)) {
        throw new NotValidError('Данные не верны!');
      }
      next(err);
    })
};

module.exports.deleteLike = (req, res, next) => {
  const user = req.user._id;
  const card = req.params.cardId;

  Card.findByIdAndUpdate(
    card,
    { $pull: { likes: user } },
    { new: true },
    )
    .then((patchedCard) => {
      if (!patchedCard) {
        throw new NotSignUserError('Карточка не найдена!');
      }
      res.send(patchedCard);
    })
    .catch((err) => {
      if (!ObjectId.isValid(req.params.cardId)) {
        throw new NotValidError('Данные не верны!');
      }
      next(err);
    })
};
