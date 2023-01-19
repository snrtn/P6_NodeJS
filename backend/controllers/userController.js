// récupère notre model User ,créer avec le schéma mongoose
const User = require('../models/userModels');

const { createJWT } = require('../utils');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

// // On utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt =  require("bcrypt");

// sauvegarde un nouvel utilisateur
const signup = async (req, res) => {

  const { email, password } = req.body;
  
  // // cherche le email
  // const emailAlreadyExists = await User.findOne({ email });
  
  // // si il y a même email, error
  // if (emailAlreadyExists) {
  //   throw new CustomError.BadRequestError('Email already exists');
  // }

  // On appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  // si il n'y a pas même email, create a new 
  var newUser = new User({
    email: email,
    password: hash
  });
  newUser.save()
      .then(response => {
        res.status(StatusCodes.CREATED).json({ user: response })
    })
    .catch(err => {
      console.error(err)
  });
};

const login = async (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials Email');
  }
  
  const token = createJWT( { userId: user.id, email: user.email } );
  res.status(StatusCodes.OK).json({ userId: user.id, token: token });
};

module.exports = {
  login,
  signup,
}