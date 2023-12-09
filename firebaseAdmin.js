const admin = require('firebase-admin');

const serviceAccount = require('./tic-project-9df42-firebase-adminsdk-l42qn-f7d45d0820.json'); // Actualizează calea către cheia ta secretă

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/1/project/tic-project-9df42/firestore/data/~2Fteams~2FZXvs6ClKTM2VyBJpY5vB', // Înlocuiește cu URL-ul bazei tale de date Firestore
});

module.exports = admin;