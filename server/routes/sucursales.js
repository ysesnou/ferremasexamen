// routes/sucursales.js
const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Asegúrate de tener esto configurado

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sucursales');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener sucursales:', error);
    res.status(500).json({ error: 'Error al obtener sucursales' });
  }
});

module.exports = router;
