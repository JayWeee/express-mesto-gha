const bodyParser = require('body-parser');
const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  putLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', bodyParser.json(), createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', putLikeCard);
router.delete('/:cardId/likes', deleteLikeCard);

module.exports = router;
