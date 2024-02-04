const express = require('express');
const router = express.Router();
const { getTeams, getPlayers, createTeam, createPlayer, updateTeam, deleteTeam, updatePlayer, deletePlayer, deletePlayerFromTeam, generateData } = require('./controller');

const { verifyToken } = require('./middleware')

router.get('/teams', getTeams);
router.get('/players', getPlayers);
router.post('/teams', verifyToken, createTeam);
router.post('/players', verifyToken, createPlayer); 
router.put('/teams/:id', verifyToken, updateTeam);
router.delete('/teams/:id', verifyToken, deleteTeam);
router.put('/players/:id', verifyToken, updatePlayer);
router.delete('/players/:id', verifyToken, deletePlayer);
router.delete('/activePlayers/:id', verifyToken, deletePlayerFromTeam);
router.post('/generate-data', verifyToken, generateData);

module.exports = router;