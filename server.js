require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const cors = require('cors');
const { verifyToken } = require('./middleware/authMiddleware'); // Charger le middleware pour vérifier le token
const authRouter = require('./routes/auth'); // Routes d'authentification

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API DocTalk !');
});

// Route protégée par le middleware verifyToken
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: "Accès autorisé", user: req.user });
});

// Routes d'authentification
app.use('/api/auth', authRouter);

// Configuration Oracle (version améliorée)
const oracledb = require('oracledb');

const initOracle = async () => {
    try {
        await oracledb.initOracleClient({ 
            libDir: process.env.ORACLE_CLIENT_PATH || 'C:\\oraclexe\\app\\oracle\\product\\11.2.0\\server\\bin'
        });
        console.log("✅ Oracle Client initialisé !");

        // Test de connexion
        const connection = await oracledb.getConnection({
            user: process.env.DB_USER || "system",
            password: process.env.DB_PASSWORD || "123456789",
            connectString: process.env.DB_CONNECTION_STRING || "localhost:1521/XE"
        });

        console.log("✅ Connexion Oracle établie !");
        const result = await connection.execute("SELECT 1 FROM DUAL");
        console.log("🔹 Test Oracle réussi :", result.rows[0]);
        await connection.close();

    } catch (err) {
        console.error("❌ Erreur Oracle:", err.message);
        process.exit(1); // Quitter si la DB échoue
    }
};

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`\n=== Serveur DocTalk ===`);
    console.log(`✅ API démarrée sur http://localhost:${PORT}`);
    console.log(`🛡️  CORS activé`);
    
    await initOracle(); // Initialiser Oracle après le serveur
});
