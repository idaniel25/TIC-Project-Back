const express = require('express');
const router = express.Router();
const { getEchipe, getJucatori, createEchipa, createJucator, updateEchipa, deleteEchipa, updateJucator, deleteJucator } = require('./controller');

router.get('/teams', getEchipe);
router.get('/players', getJucatori);
router.post('/teams', createEchipa); // Adăugată ruta pentru crearea echipei
router.post('/players', createJucator); 
router.put('/echipe/:id', updateEchipa);
router.delete('/echipe/:id', deleteEchipa);
router.put('/jucatori/:id', updateJucator);
router.delete('/jucatori/:id', deleteJucator);

module.exports = router;
