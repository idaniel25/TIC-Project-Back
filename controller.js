const admin = require('./firebaseAdmin');

const db = admin.firestore();

// Controlor pentru echipe
const getEchipe = async (req, res) => {
  try {
    const snapshot = await db.collection('teams').get();
    const echipe = [];
    snapshot.forEach(doc => {
      echipe.push({ id: doc.id, ...doc.data() });
    });
    res.json(echipe);
  } catch (error) {
    console.error('Eroare la obținerea echipei:', error);
    res.status(500).json({ error: 'Eroare la obținerea echipei' });
  }
};

// Controlor pentru jucatori
const getJucatori = async (req, res) => {
  try {
    const snapshot = await db.collection('players').get();
    const jucatori = [];
    snapshot.forEach(doc => {
      jucatori.push({ id: doc.id, ...doc.data() });
    });
    res.json(jucatori);
  } catch (error) {
    console.error('Eroare la obținerea jucătorilor:', error);
    res.status(500).json({ error: 'Eroare la obținerea jucătorilor' });
  }
};

module.exports = { getEchipe, getJucatori };