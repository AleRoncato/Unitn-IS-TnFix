const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Accesso negato' });

  try {
    const verified = jwt.verify(token, process.env.SSKEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token non valido' });
  }
};

module.exports = authenticateToken;
