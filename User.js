const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

// Obtenir un utilisateur par email
async function getUserByEmail(email) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT ID, NOM, EMAIL, mot_de_passe, ROLE FROM USERS WHERE EMAIL = :email`,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur:', error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
}

// Créer un nouvel utilisateur avec un hash sécurisé
async function createUser(nom, email, hashedPassword, role) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        await connection.execute(
            `INSERT INTO USERS (NOM, EMAIL, mot_de_passe, ROLE) VALUES (:nom, :email, :mot_de_passe, :role)`,
            [nom, email, hashedPassword, role],
            { autoCommit: true }
        );
    } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur:', error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = { getUserByEmail, createUser };
