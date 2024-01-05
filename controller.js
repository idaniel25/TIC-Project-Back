const admin = require('./firebaseAdmin');
//ADAUGA VALIDARI IN CAZUL IN CARE TEAM_ID NU ESTE VALID SAU NU EXISTA IN BD
//CAND STERG O ECHIPA SE STERG SI JUCATORII DIN ECHIPA ACEEA
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
    // Verifică dacă echipa există
    const teamDoc = await db.collection('teams').doc(id).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ error: 'Echipa specificată nu există.' });
    }

    // Actualizează numele echipei
    await db.collection('teams').doc(id).update({ name });

    res.status(200).json({ message: 'Echipa actualizată cu succes.' });
  } catch (error) {
    console.error('Eroare la actualizarea echipei:', error);
    res.status(500).json({ error: 'Eroare la actualizarea echipei.' });
  }
};

const deleteEchipa = async (req, res) => {
  try {
    const { id } = req.params;
    // Verifică dacă echipa există
    const teamDoc = await db.collection('teams').doc(id).get();
    if (!teamDoc.exists) {
      return res.status(404).json({ error: 'Echipa specificată nu există.' });
    }

     // Obține lista de jucători din echipă
     const playersSnapshot = await db.collection('players').where('team_id', '==', id).get();

     // Șterge toți jucătorii din echipă
     const deletePlayerPromises = playersSnapshot.docs.map(async (playerDoc) => {
       await db.collection('players').doc(playerDoc.id).delete();
     });
 
     await Promise.all(deletePlayerPromises);

    // Șterge echipa
    await db.collection('teams').doc(id).delete();

    res.json({ id });
  } catch (error) {
    console.error('Eroare la ștergerea echipei:', error);
    res.status(500).json({ error: 'Eroare la ștergerea echipei.' });
  }
};

// CRUD pentru jucători
const createJucator = async (req, res) => {
  try {
    const { name } = req.body;
    const jucatorRef = await db.collection('players').add({ name, team_id: '' });
    const jucatorDoc = await jucatorRef.get();
    const jucator = jucatorDoc.data();
    jucator.id = jucatorDoc.id;

    res.json(jucator);
  } catch (error) {
    console.error('Eroare la crearea jucătorului:', error);
    res.status(500).json({ error: 'Eroare la crearea jucătorului.' });
  }
};

const updateJucator = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, team_id } = req.body;

    // Verifică dacă jucătorul există
    const playerDoc = await db.collection('players').doc(id).get();
    if (!playerDoc.exists) {
      return res.status(404).json({ error: 'Jucătorul specificat nu există.' });
    }

    // Obține vechea echipă a jucătorului
    const jucator = playerDoc.data();

    // Dacă team_id nu este furnizat, setează-l la null
    const newTeamId = team_id || '';

    // Crează referința veche a jucătorului
    const jucatorRef = db.collection('players').doc(id);

    // Actualizează referința echipei veche cu referința veche a jucătorului
    if (jucator.team_id) {
      await db.collection('teams').doc(jucator.team_id).update({
        players: admin.firestore.FieldValue.arrayRemove(jucatorRef),
      });
    }

    // Actualizează jucătorul
    await db.collection('players').doc(id).update({ name, team_id: newTeamId });

    // Actualizează referința echipei noi cu referința nouă a jucătorului
    if (newTeamId) {
      await db.collection('teams').doc(newTeamId).update({
        players: admin.firestore.FieldValue.arrayUnion(jucatorRef),
      });
    }

    res.status(200).json({ message: 'Jucător actualizat cu succes.' });
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
    // Verifică dacă jucătorul are o echipă înainte de a actualiza referința echipei
    if (jucator.team_id) {
      await db.collection('teams').doc(jucator.team_id).update({
        players: admin.firestore.FieldValue.arrayRemove(db.collection('players').doc(id)),
      });
    }

    res.json({ id });
  } catch (error) {
    console.error('Eroare la ștergerea jucătorului:', error);
    res.status(500).json({ error: 'Eroare la ștergerea jucătorului.' });
  }
};

const deletePlayerFromTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // Obține vechea echipă a jucătorului
    const playerDoc = await db.collection('players').doc(id).get();
    if (!playerDoc.exists) {
      return res.status(404).json({ error: 'Jucătorul specificat nu există.' });
    }

    const playerData = playerDoc.data();

    // Șterge jucătorul din echipă
    await db.collection('teams').doc(playerData.team_id).update({
      players: admin.firestore.FieldValue.arrayRemove(id),
    });

    // Actualizează jucătorul pentru a înlătura echipa
    await db.collection('players').doc(id).update({
      team_id: '',
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
  deletePlayerFromTeam,
};