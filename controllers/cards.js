const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.status(200).send(cards));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then((card) => res.status(200).send(card));
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).then(() => res.send({ message: 'Пост удален' }));
};

const putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.status(200).send(card));
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.status(200).send(card));
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putLikeCard,
  deleteLikeCard,
};
