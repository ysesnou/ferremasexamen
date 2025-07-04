// middlewares/authAdmin.js
module.exports = function (req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. No eres administrador.' });
  }
};