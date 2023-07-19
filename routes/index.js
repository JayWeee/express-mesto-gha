const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;

const router = require('express').Router();
const auth = require('../middlewares/auth');

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const authRouter = require('./auth');

router.use('/', authRouter);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

router.use('/', (req, res) => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Такого пути не существует.' }));

module.exports = {
  router,
};
