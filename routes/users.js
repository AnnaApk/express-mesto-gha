const router = require('express').Router();
const {postUser, getUsers, getUserById, patchUser, patchUserAvatar} = require('../controllers/users');


router.post('/users', postUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchUserAvatar);

module.exports = router;
