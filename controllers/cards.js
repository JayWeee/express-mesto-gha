const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;

const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' }))
    .then(() => {
      res.send({ message: 'Пост удален' });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const putLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' }))
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' }))
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putLikeCard,
  deleteLikeCard,
};
