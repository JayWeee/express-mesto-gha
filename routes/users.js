const bodyParser = require('body-parser');
const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', bodyParser.json(), createUser);
router.get('/:userId', getUserById);
router.patch('/me', bodyParser.json(), updateUserProfile);
router.patch('/me/avatar', bodyParser.json(), updateUserAvatar);

module.exports = router;
