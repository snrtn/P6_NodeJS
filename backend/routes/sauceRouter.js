const express = require('express');
const router = express.Router();


const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const sauceController = require('../controllers/sauceController')

router.post('/', auth, multer, sauceController.createSauce);
router.put('/:id', auth, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.get('/:id', auth, sauceController.getOneSauce);
router.get('/', auth, sauceController.getAllSauce);
router.post('/:id/like', auth, sauceController.likeDislike);

module.exports = router;