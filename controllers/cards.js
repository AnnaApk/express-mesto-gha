const Card = require('../models/card');

module.exports.postCard = (req, res) => {
  const owner = req.user._id;
  const { name, link, likes, createdAt } = req.body;

  Card.create({ name, link, owner, likes, createdAt })
    .then(card => res.send({ data: card }))
    .catch(err => console.log('error', err));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => console.log('error', err));
};

module.exports.getCardById = (req, res) => {
  Card.findById(req.params.id)
    .then(card => res.send(card))
    .catch(err => console.log('error', err));
};

module.exports.addLike = (req, res) => {
  const user = req.user._id;
  const card = req.params.cardId;
  Card.findByIdAndUpdate(
    card,
    {$addToSet: { likes: user }},
    { new: true }
    )
    .then(card => res.send(card))
    .catch(err => console.log('error', err));
};

module.exports.deleteLike = (req, res) => {
  const user = req.user._id;
  const card = req.params.cardId;
  Card.findByIdAndUpdate(
    card,
    {$pull: { likes: user }},
    { new: true }
    )
    .then(card => res.send(card))
    .catch(err => console.log('error', err));
};
