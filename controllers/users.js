const {
  HTTP_STATUS_OK,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_UNAUTHORIZED,
} = require('http2').constants;

const { hash, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');

const SECRET_KEY = 'verry-secret-key';

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' }));
};

const getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' }))
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  hash(password, 10)
    .then((hashPassword) => User.create({
      name,
      about,
      avatar,
      email,
      password: hashPassword,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else if (err.code === 11000) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Пользователь с таким email уже существует.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const updateUser = (req, res, obj) => {
  User.findByIdAndUpdate(req.user._id, obj, {
    new: true,
    runValidators: true,
  }).then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  return updateUser(req, res, { name, about });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  return updateUser(req, res, { avatar });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Неправильная почта или пароль.' }))
    .then((user) => compare(password, user.password)
      .then((matched) => {
        if (!matched) res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Неправильная почта или пароль.' });

        const token = jwt.sign(
          { _id: user._id },
          SECRET_KEY,
          { expiresIn: '7d' },
        );
        res.cookie('token', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
          .status(HTTP_STATUS_OK).send({ message: 'Успешная авторизация.' });
      }))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера.' }));
};

module.exports = {
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
