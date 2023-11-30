const express = require('express');
const admin = require('firebase-admin');

// Configurare Firebase Admin SDK
const serviceAccount = require('./tic-project-9df42-firebase-adminsdk-l42qn-f7d45d0820.json'); // Adaugă calea corectă către cheile de autentificare
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Obține o referință la Firestore
const db = admin.firestore();

const app = express();

// Definirea rutelor și logicilor de server continuă aici...

// Ruta pentru un mesaj de testare
app.get('/', (req, res) => {
    res.send('Serverul backend rulează cu succes!');
  });

// Ascultă pe un anumit port (de exemplu, 3000)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});