const mongoose = require('mongoose');
require('mongoose-type-email');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);