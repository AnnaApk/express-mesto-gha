const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  postCard, getCards, deleteCardById, addLike, deleteLike,
} = require('../controllers/cards');

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().length(179),
  }),
}), postCard);

router.get('/cards', getCards);
router.delete('/cards/:id', deleteCardById);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().length(179),
  }),
}), addLike);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().length(179),
  }),
}), deleteLike);

module.exports = router;
