const router = require('express').Router();
const {postCard, getCards, getCardById, addLike, deleteLike} = require('../controllers/cards');

router.post('/cards', postCard);
router.get('/cards', getCards);
router.get('/cards/:id', getCardById);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;
