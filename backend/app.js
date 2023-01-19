// utilisation du module 'dotenv' pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();
const connectDB = require('./db/connect');

require('express-async-errors');

// import des modules npm - Ajout des plugins externes
// Importation d'express => Framework basé sur node.js
const express = require('express');

// Création d'une application express
const app = express();

// Cross Origin Resource Sharing
const cors = require('cors')

// https://github.com/fiznool/express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');

// donne accès au chemin de notre système de fichier
const path = require('path');

// importe la route dédiée aux utilisateurs
const userRouter = require('./routes/userRouter');

// importe la route dédiée aux sauces
const sauceRouter = require('./routes/sauceRouter');

app.use(mongoSanitize());
app.use(express.json());
app.use(cors())

// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(express.urlencoded({extended: true}));

// Va servir les routes dédiées aux utilisateurs
app.use('/api/auth', userRouter);

// Va servir les routes dédiées aux sauces
app.use('/api/sauces', sauceRouter);

// Gestion de la ressource image de façon statique
// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();