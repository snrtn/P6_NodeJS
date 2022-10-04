const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://node:5Jlt8Jn2Qv16jknk@openclassrooms.pia2lu2.mongodb.net/?retryWrites=true&w=majority',
  function (req, res) {
    app.listen(8080, function () {
      console.log('Hello World!');
    });

    app.get('/', function (req, res) {
      res.send('page');
    });
  }
);
