// middleware.js
const admin = require('./firebaseAdmin');


// Middleware pentru verificarea tokenului JWT
const verifyToken = async (req, res, next) => {
  try {
    // Verifică dacă utilizatorul este autentificat
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(idToken)
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Eroare la verificarea tokenului JWT:', error);
    res.status(401).json({ error: 'Token JWT nevalid sau lipsă.' });
  }
}; 

module.exports = { verifyToken };
