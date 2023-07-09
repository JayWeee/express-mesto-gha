const express = require('express');
const mongoose = require('mongoose');
const { router } = require('./routes');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64a66221f7d76c5bcda71df9',
  };

  next();
});

app.use(router);

app.listen(PORT);
