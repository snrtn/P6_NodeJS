const express = require('express');

// crée un router avec la méthode mise à disposition par Express
const router = express.Router();

// associe les fonctions aux différentes routes, on importe le controller
const userController = require('../controllers/userController');

// Crée un nouvel utilisateur
router.post('/signup', userController.signup);

// Connecte un utilisateur
router.post('/login', userController.login);

module.exports = router;