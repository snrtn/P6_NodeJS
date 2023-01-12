// récupère notre model User ,créer avec le schéma mongoose
const User = require('../models/userModels');
const { createJWT } = require('../utils');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');


// sauvegarde un nouvel utilisateur
const signup = async (req, res) => {

  const { email, password } = req.body;
  
  // cherche le email
  const emailAlreadyExists = await User.findOne({ email });
  
  // si il y a même email, error
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // si il n'y a pas même email, create a new 
  var newUser = new User({
    email: email,
    password: password
  });
  newUser.save()
      .then(response => {
        console.log(response)
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