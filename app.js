const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const userRoute = require('./routes/users');
const cardRoute =require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62a4c4aeaa15d24ac0e88132'
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true
});

app.use('/', userRoute);
app.use('/', cardRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});
