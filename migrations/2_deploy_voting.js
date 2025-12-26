// migrations/2_deploy_voting.js
const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
    // Les temps sont en secondes (timestamp Unix)
    const ONE_MINUTE = 60;
    const ONE_WEEK = 60 * 60 * 24 * 7; 

    // Conversion robuste en entier (nombre de secondes depuis 1970)
    const CURRENT_TIME_SECS = Math.floor(Date.now() / 1000); 

    // Le vote commence dans 1 minute
    const START_TIME = CURRENT_TIME_SECS + ONE_MINUTE; 
    // Le vote se termine une semaine après
    const END_TIME = START_TIME + ONE_WEEK; 

    // Ajout d'un log pour vérifier que les valeurs sont des entiers (facultatif mais recommandé)
    console.log(`\nDéploiement du Contrat Voting avec les dates :`);
    console.log(`Début (Unix Timestamp): ${START_TIME}`);
    console.log(`Fin (Unix Timestamp): ${END_TIME}\n`);

    // Déploiement du contrat en lui passant les dates de début et de fin
    deployer.deploy(Voting, START_TIME, END_TIME);
};