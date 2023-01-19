// On importe multer qui est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// On crée un objet de configuration pour préciser à multer où enregistrer les fichiers images et les renommer
const storage = multer.diskStorage({
  // On mets la destination d'enregistrement des images
  destination: (req, file, callback) => {
    // On passe le dossier images qu'on a créé dans le backend
    callback(null, 'images');
  },
  // On dit à multer quel nom de fichier on utilise pour éviter les doublons
  filename: (req, file, callback) => {
    // On génère un nouveau nom avec le nom d'origine, on supprime les espaces (white space avec split) et on insère des underscores à la place
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];

    // On appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur
    // et on crée le filename en entier, on ajoute un timestamp, un point et enfin l'extension du fichier
    callback(null, name + Date.now() + '.' + extension);
    // Genère le nom complet du fichier- Nom d'origine + numero unique + . + extension
  }
});

module.exports = multer({storage: storage}).single('image');