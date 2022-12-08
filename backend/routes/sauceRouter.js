const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauceController')

router.post('/', sauceController.createSauce);
router.put('/:id', sauceController.modifySauce);
router.delete('/:id', sauceController.deleteSauce);
router.get('/:id', sauceController.getOneSauce);
router.get('/', sauceController.getAllSauce);
router.post('/:id/like', sauceController.likeDislike);

module.exports = router;