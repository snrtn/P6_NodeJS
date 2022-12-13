const Sauce = require('../models/sauceModels');
const fs = require('fs');

const createSauce = async (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject.id
  
  const sauce = new Sauce({
    userId: req.auth.userId,
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    mainPepper: sauceObject.mainPepper,
    heat: sauceObject.heat,
  })

  sauce.save().then(() => res.status(201).json({
    message: "saved",
  }))
  console.log(sauce);
};
const modifySauce = async (req, res) => {

};
const deleteSauce = async (req, res) => {
  Sauce.findOne({
    _id: req.params.id
  })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({
          _id: req.params.id
        })
        .then(() => res.status(200).json({
          message: 'delete'
        }))
        .catch(error => res.status(400).json({
          error
        }));
    });
  })
  .catch(error => res.status(500).json({
    error
  }));
};
const getOneSauce = async (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};
const getAllSauce = async (req, res) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};
const likeDislike = async (req, res) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id

  if (like === 1) {
    Sauce.updateOne({
        _id: sauceId
      }, {
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        },
      })
      .then(() => res.status(200).json({
        message: 'déjà'
      }))
  }
  if (like === -1) {
    Sauce.updateOne(
        {
          _id: sauceId
        }, {
          $push: {
            usersDisliked: userId
          },
          $inc: {
            dislikes: +1
          }, 
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'déjà'
        })
      })
  }
  if (like === 0) {
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { 
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersLiked: userId
              },
              $inc: {
                likes: -1
              },
            })
            .then(() => res.status(200).json({
              message: 'status 200'
            }))
        }
        if (sauce.usersDisliked.includes(userId)) 
        { 
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              },
            })
            .then(() => res.status(200).json({
              message: 'status 200'
            }))
        }
      })
    }
};

module.exports = {
  createSauce,
  modifySauce,
  deleteSauce,
  getOneSauce,
  getAllSauce,
  likeDislike,
}