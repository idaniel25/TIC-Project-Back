const express = require('express');
const cors = require('cors');
const admin = require('./firebaseAdmin');
const controller = require('./controller');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rute pentru echipe și jucatori
// app.get('/teams', controller.getEchipe);
// app.get('/players', controller.getJucatori);
app.use('/', routes);
// app.get('/echipe-jucatori', controller.getEchipeJucatori);
// app.get('/echipe/:id', controller.getEchipe);
// app.put('/echipe/:id', controller.updateEchipa);
// app.delete('/echipe/:id', controller.deleteEchipa);
// app.put('/jucatori/:id', controller.updateJucator);
// app.delete('/jucatori/:id', controller.deleteJucator);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});