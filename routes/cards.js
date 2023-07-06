const bodyParser = require('body-parser');
const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', bodyParser.json(), createCard);
router.delete('/cards/:cardId', deleteCardById);
router.put('/cards/:cardId/likes', putLikeCard);
router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;
