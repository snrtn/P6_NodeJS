// récupère notre model User ,créer avec le schéma mongoose
const User = require('../models/userModels');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');


// sauvegarde un nouvel utilisateur
const signup = async (req, res) => {      
  const user = await User.create({ email: req.body.email, password: req.body.password });
  user.save()
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email, password: password });

  const token = jwt.sign(
    {expiresIn: '24h'},
  )
  res.status(StatusCodes.OK).json({ userId: user.id, token: token });
};

module.exports = {
  login,
  signup,
}