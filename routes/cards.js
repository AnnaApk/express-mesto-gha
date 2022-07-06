const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  postCard, getCards, deleteCardById, addLike, deleteLike,
} = require('../controllers/cards');

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\/\/[a-z0-9\D]*\.{1}[a-z0-9\D]*/),
  }),
  // headers: Joi.object().keys({
  //   authorization: Joi.string().required(),
  // }).unknown(true),
}), postCard);

router.get('/cards', getCards);

router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
  // headers: Joi.object().keys({
  //   authorization: Joi.string().required(),
  // }).unknown(true),
}), deleteCardById);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  // headers: Joi.object().keys({
  //   authorization: Joi.string().required(),
  // }).unknown(true),
}), addLike);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  // headers: Joi.object().keys({
  //   authorization: Joi.string().required(),
  // }).unknown(true),
}), deleteLike);

module.exports = router;
