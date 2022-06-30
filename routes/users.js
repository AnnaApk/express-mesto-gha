const router = require('express').Router();
const {
  getUsers, getUserById, patchUser, patchUserAvatar, authorizedUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', authorizedUser);
router.get('/users/:id', getUserById);
router.patch('/users/me', patchUser);
router.patch('/users/me/avatar', patchUserAvatar);

module.exports = router;
