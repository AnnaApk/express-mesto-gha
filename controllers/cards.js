const Card = require('../models/card');

module.exports.postCard = (req, res) => {
  const owner = req.user._id;
  const { name, link, likes, createdAt } = req.body;

  Card.create({ name, link, owner, likes, createdAt })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: "Данные карточки не верны!"})
        return;
      }
      res.status(500).send({message: err.message})
    }
  );
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.getCardById = (req, res) => {
  Card.findById(req.params.id)
    .then(card => {
      if (!card) {
        res.status(404).send({message: 'Карточка не найдена!'})
        return;
      }
      res.send(card)})
    .catch(err => res.status(500).send({message: err.message}));
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
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Данные не верны!'})
        return;
      }
      res.status(500).send({message: err.message})
    }
  );
};

module.exports.deleteLike = (req, res) => {
  const user = req.user._id;
  const card = req.params.cardId;
  Card.findByIdAndUpdate(
    card,
    {$pull: { likes: user }},
    { new: true }
    )
    .then(card => {
      if (!card) {
        res.status(404).send({message: 'Карточка не найдена!'})
        return;
      }
      res.send(card)})
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Данные не верны!'})
        return;
      }
      res.status(500).send({message: err.message})
    }
  );
};
