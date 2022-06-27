const router = require('express').Router();
const {
  postCard, getCards, deleteCardById, addLike, deleteLike,
} = require('../controllers/cards');

router.post('/cards', postCard);
router.get('/cards', getCards);
router.delete('/cards/:id', deleteCardById);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
