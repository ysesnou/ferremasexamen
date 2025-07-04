const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'ferremas_secret';

// Middleware de autenticación (para DB real)
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Token inválido',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
      });
    }

    // Solo guardamos id y email del usuario decodificado
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    
    next();
  });
}

module.exports = { authenticateToken };
