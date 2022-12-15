const express = require('express');
const router = express.Router();

// importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');

// importe le middleware auth pour sécuriser les routes
// Récupère la configuration d'authentification JsonWebToken
const auth = require('../middleware/auth');

// associe les fonctions aux différentes routes, on importe le controller
const sauceController = require('../controllers/sauceController')

// Route qui permet de créer "une sauce"
router.post('/', auth, multer, sauceController.createSauce);

// Route qui permet de supprimer "une sauce"
router.put('/:id', auth, multer, sauceController.modifySauce);

// Route qui permet de supprimer "une sauce"
router.delete('/:id', auth, sauceController.deleteSauce);

// Route qui permet de cliquer sur une des sauces précise
router.get('/:id', auth, sauceController.getOneSauce);

// Route qui permet de récupérer toutes les sauces
router.get('/', auth, sauceController.getAllSauce);

// Route qui permet de gérer les likes des sauces
router.post('/:id/like', auth, sauceController.likeDislike);

module.exports = router;