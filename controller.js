const admin = require('./firebaseAdmin');
//ADAUGA VALIDARI IN CAZUL IN CARE TEAM_ID NU ESTE VALID SAU NU EXISTA IN BD
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

// CRUD pentru echipe
const createEchipa = async (req, res) => {
  try {
    const { name } = req.body;
    const echipaRef = await db.collection('teams').add({ name, players: [] });
    const echipaDoc = await echipaRef.get();
    const echipa = echipaDoc.data();
    echipa.id = echipaDoc.id;

    res.json(echipa);
  } catch (error) {
    console.error('Eroare la crearea echipei:', error);
    res.status(500).json({ error: 'Eroare la crearea echipei.' });
  }
};

const updateEchipa = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await db.collection('echipe').doc(id).update({ name });

    res.json({ id, name });
  } catch (error) {
    console.error('Eroare la actualizarea echipei:', error);
    res.status(500).json({ error: 'Eroare la actualizarea echipei.' });
  }
};

const deleteEchipa = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('echipe').doc(id).delete();

    res.json({ id });
  } catch (error) {
    console.error('Eroare la ștergerea echipei:', error);
    res.status(500).json({ error: 'Eroare la ștergerea echipei.' });
  }
};

// CRUD pentru jucători
const createJucator = async (req, res) => {
  try {
    const { name, team_id } = req.body;
    const jucatorRef = await db.collection('players').add({ name, team_id });
    const jucatorDoc = await jucatorRef.get();
    const jucator = jucatorDoc.data();
    jucator.id = jucatorDoc.id;

    // Actualizează referința echipei cu referința noului jucător
    await db.collection('teams').doc(team_id).update({
      players: admin.firestore.FieldValue.arrayUnion(jucatorRef),
    });

    res.json(jucator);
  } catch (error) {
    console.error('Eroare la crearea jucătorului:', error);
    res.status(500).json({ error: 'Eroare la crearea jucătorului.' });
  }
};

const updateJucator = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, idEchipa } = req.body;

    // Obține vechea echipă a jucătorului
    const jucatorDoc = await db.collection('jucatori').doc(id).get();
    const jucator = jucatorDoc.data();
    
    // Actualizează referința echipei veche cu referința veche a jucătorului
    await db.collection('echipe').doc(jucator.idEchipa).update({
      playersRefs: admin.firestore.FieldValue.arrayRemove(jucatorRef),
    });

    // Actualizează jucătorul
    await db.collection('jucatori').doc(id).update({ name, idEchipa });

    // Actualizează referința echipei noi cu referința nouă a jucătorului
    await db.collection('echipe').doc(idEchipa).update({
      playersRefs: admin.firestore.FieldValue.arrayUnion(db.collection('jucatori').doc(id)),
    });

    res.json({ id, name, idEchipa });
  } catch (error) {
    console.error('Eroare la actualizarea jucătorului:', error);
    res.status(500).json({ error: 'Eroare la actualizarea jucătorului.' });
  }
};

const deleteJucator = async (req, res) => {
  try {
    const { id } = req.params;

    // Obține vechea echipă a jucătorului
    const jucatorDoc = await db.collection('players').doc(id).get();
    if (!jucatorDoc.exists) {
      return res.status(404).json({ error: 'Jucătorul specificat nu există.' });
    }
    const jucator = jucatorDoc.data();

    // Șterge jucătorul
    await db.collection('players').doc(id).delete();

    // Actualizează referința echipei veche cu referința veche a jucătorului
    await db.collection('teams').doc(jucator.team_id).update({
      players: admin.firestore.FieldValue.arrayRemove(db.collection('players').doc(id)),
    });

    res.json({ id });
  } catch (error) {
    console.error('Eroare la ștergerea jucătorului:', error);
    res.status(500).json({ error: 'Eroare la ștergerea jucătorului.' });
  }
};

module.exports = {
  getEchipe,
  getJucatori,
  createEchipa,
  updateEchipa,
  deleteEchipa,
  createJucator,
  updateJucator,
  deleteJucator,
};