const bodyParser = require('body-parser');
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', bodyParser.json(), createUser);
router.patch('/users/me', bodyParser.json(), updateUserProfile);
router.patch('/users/me/avatar', bodyParser.json(), updateUserAvatar);

module.exports = router;
