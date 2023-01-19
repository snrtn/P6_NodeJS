// On récupère le package jsonwebtoken
const jwt = require('jsonwebtoken');

// Ce middleware sera appliqué à toutes les routes afin de les sécuriser
module.exports = (req, res, next) => {
  try {
    // On récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split)
	const token = req.headers.authorization.split(' ')[1];

  // On vérifie le token décodé avec la clé secrète initiéé avec la création du token encodé initialement (Cf Controller user), les clés doivent correspondre
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
	const userId = decodedToken.userId;
  req.auth = {
    userId: userId
  };

  // si tout est valide on passe au prochain middleware
	next();
  } catch(error) { // probleme d'autentification si erreur dans les inscrutions
    res.status(401).json({ error });
  }
};