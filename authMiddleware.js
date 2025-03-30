const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token
function verifyToken(req, res, next) {
    const token = req.headers['authorization']; // Le token sera passé dans les headers sous 'authorization'
    if (!token) {
        return res.status(403).json({ message: "Token requis" });
    }

    // Supprimer "Bearer " du début du token
    const tokenWithoutBearer = token.split(" ")[1];

    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide" });
        }
        req.user = decoded; // Ajouter les données du token dans la requête pour un accès facile
        next(); // Passer à la route suivante
    });
}

module.exports = { verifyToken };
