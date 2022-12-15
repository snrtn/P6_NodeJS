// Création d'un model user avec mongoose, on importe donc mongoose
const mongoose = require('mongoose');
require('mongoose-type-email');

// rajoute ce validateur 
const validator = require('validator');

// utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcryptjs');


// crée notre schéma de données dédié à l'utilisateur
const UserSchema = mongoose.Schema({
  // L'email doit être unique
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  // enregistrement du mot de pass
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  }
});

UserSchema.pre('save', async function () {
  // if (!this.isModified('password')) return;
  console.log(this.password)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password)
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);