const express = require('express');
const router = express.Router();
const { getEchipe, getJucatori, createEchipa, createJucator, updateEchipa, deleteEchipa, updateJucator, deleteJucator, deletePlayerFromTeam, generateData } = require('./controller');

const { verifyToken } = require('./middleware')

router.get('/teams', getEchipe);
router.get('/players', getJucatori);
router.post('/teams', verifyToken, createEchipa); // Adăugată ruta pentru crearea echipei
router.post('/players', verifyToken, createJucator); 
router.put('/teams/:id', verifyToken, updateEchipa);
router.delete('/teams/:id', verifyToken, deleteEchipa);
router.put('/players/:id', verifyToken, updateJucator);
router.delete('/players/:id', verifyToken, deleteJucator);
router.delete('/activePlayers/:id', verifyToken, deletePlayerFromTeam);
router.post('/generate-data', verifyToken, generateData);

module.exports = router;