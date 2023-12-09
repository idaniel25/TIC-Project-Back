const express = require('express');
const cors = require('cors');
const admin = require('./firebaseAdmin');
const controller = require('./controller');

const app = express();

app.use(cors());
app.use(express.json());

// Rute pentru echipe și jucatori
app.get('/teams', controller.getEchipe);
app.get('/players', controller.getJucatori);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});