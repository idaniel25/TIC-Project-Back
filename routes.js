const express = require('express');
const router = express.Router();
const { getEchipe, getJucatori, createEchipa, createJucator, updateEchipa, deleteEchipa, updateJucator, deleteJucator, deletePlayerFromTeam } = require('./controller');

router.get('/teams', getEchipe);
router.get('/players', getJucatori);
router.post('/teams', createEchipa); // Adăugată ruta pentru crearea echipei
router.post('/players', createJucator); 
router.put('/teams/:id', updateEchipa);
router.delete('/teams/:id', deleteEchipa);
router.put('/players/:id', updateJucator);
router.delete('/players/:id', deleteJucator);
router.delete('/activePlayers/:id', deletePlayerFromTeam);

module.exports = router;
