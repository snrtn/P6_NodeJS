// Création d'un model user avec mongoose, on importe donc mongoose
const mongoose = require('mongoose');
require('mongoose-type-email');

// On rajoute ce validateur comme plugin
const uniqueValidator = require('mongoose-unique-validator');
// package qui valide l'unicité de l'email
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

// crée notre schéma de données dédié à l'utilisateur
const UserSchema = mongoose.Schema({
  // L'email doit être unique
  email: {
    type: String,
    unique: true,
    required: [true, "Veuillez entrer votre adresse email"],
    match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]
  },
  // enregistrement du mot de password
  password: {
    type: String,
    required: [true, "Veuillez choisir un mot de passe"]
  }
});


// Plugin pour garantir un email unique
// On applique ce validateur au schéma avant d'en faire un modèle et on appelle la méthode plugin et on lui passe uniqueValidator
UserSchema.plugin(uniqueValidator);

// Plugin pour Mongoose qui purifie les champs du model avant de les enregistrer dans la base MongoDB.
// On utilise le HTML Sanitizer de Google Caja pour effectuer cette désinfection.
UserSchema.plugin(sanitizerPlugin);


module.exports = mongoose.model('User', UserSchema);