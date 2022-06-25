const User = require('../models/user');

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => console.log('error', err));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => console.log('error', err));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send(user))
    .catch(err => console.log('error', err));
};

module.exports.patchUser = (req, res) => {
  const user = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    user,
    {name: name, about: about},
    {new: true, runValidators: true}
    )
    .then(user => res.send({ data: user }))
    .catch(err => console.log('error', err));
};

module.exports.patchUserAvatar = (req, res) => {
  const user = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    user,
    {avatar: avatar},
    {new: true, runValidators: true}
    )
    .then(user => res.send({ data: user }))
    .catch(err => console.log('error', err));
};
