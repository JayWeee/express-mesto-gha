const jwt = require('jsonwebtoken');
const { HTTP_STATUS_UNAUTHORIZED } = require('http2').constants;

const SECRET_KEY = 'verry-secret-key';

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация.' });
    return;
  }

  let peyload;
  try {
    peyload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Необходима авторизация.' });
    return;
  }

  req.user = peyload;

  next();
};
