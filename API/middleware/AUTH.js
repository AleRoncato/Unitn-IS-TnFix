const jwt = require("jsonwebtoken");
const SSKEY = process.env.SSKEY;

// Middleware per autenticare il token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Accesso negato" });

  try {
    const verified = jwt.verify(token, SSKEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token non valido" });
  }
};

export default authenticateToken;