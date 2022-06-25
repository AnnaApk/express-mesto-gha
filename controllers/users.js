const User = require('../models/user');

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Данные пользователя не верны!'})
        return;
      }
      res.status(500).send({message: err.message})
    }
  );
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).send({message: 'Пользователь не найден!'})
        return;
      }
      res.send(user)})
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.patchUser = (req, res) => {
  const user = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    user,
    {name: name, about: about},
    {new: true, runValidators: true}
    )
    .then(user => {
      if (!user) {
        res.status(404).send({message: 'Пользователь не найден!'})
        return;
      }
      res.send(user)})
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Данные пользователя не верны!'})
        return;
      }
      res.status(500).send({message: err.message})
    }
  );
};

module.exports.patchUserAvatar = (req, res) => {
  const user = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    user,
    {avatar: avatar},
    {new: true, runValidators: true}
    )
    .then(user => {
      if (!user) {
        res.status(404).send({message: 'Пользователь не найден!'})
        return;
      }
      res.send(user)})
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({message: 'Данные пользователя не верны!'})
        return;
      }
      res.status(500).send({message: err.message})
    }
  );
};
