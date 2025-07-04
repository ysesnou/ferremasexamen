const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({ message: 'Listado de productos (temporal)' });
});

module.exports = router;
