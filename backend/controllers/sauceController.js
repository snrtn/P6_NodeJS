const Sauce = require('../models/sauceModels');

// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require('fs');

const createSauce = async (req, res) => {

  // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
  const sauceObject = JSON.parse(req.body.sauce);

  // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
  delete sauceObject.id
  

  // Création d'une instance du modèle Sauce
  const sauce = new Sauce({
    userId: req.auth.userId,
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    mainPepper: sauceObject.mainPepper,
    heat: sauceObject.heat,
  })

  // Sauvegarde de la sauce dans la base de donnéesw
  sauce.save()
    .then(() => res.status(201).json({
    message: "saved",
  }))
};

const modifySauce = async (req, res, next) => {
  let sauceObject = {};
  req.file ? (
    // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      // On supprime l'ancienne image du serveur
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      // modifie les données et on ajoute la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    }
  ) : ( 
    // Si la modification ne contient pas de nouvelle image
    sauceObject = {
      ...req.body
    }
  )
  Sauce.updateOne(
    // applique les paramètre de sauceObject
    {
      _id: req.params.id
    }, {
      ...sauceObject,
      _id: req.params.id
    }
  )
  .then(() => res.status(200).json({
    message: 'modifiée'
  }))
  .catch((error) => res.status(400).json({
    error
  }))
};

const deleteSauce = async (req, res) => {
  // Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
  Sauce.findOne({
    _id: req.params.id
  })
  .then(sauce => {
    // Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
    const filename = sauce.imageUrl.split('/images/')[1];

    // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
    fs.unlink(`images/${filename}`, () => {

      // On supprime le document correspondant de la base de données
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

  // Like présent dans le body
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id


  // Si il s'agit d'un like
  if (like === 1) {
    Sauce.updateOne({
        _id: sauceId
      }, {
        // On push l'utilisateur et on incrémente le compteur de 1
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

  // S'il s'agit d'un dislike
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

  // Si il s'agit d'annuler un like ou un dislike
  if (like === 0) {
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        // Si il s'agit d'annuler un like
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

        // Si il s'agit d'annuler un dislike
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