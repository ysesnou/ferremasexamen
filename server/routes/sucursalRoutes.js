const express = require('express');
const router = express.Router();
const Sucursal = require('../models/Sucursal');

// Crear sucursal
router.post('/', async (req, res) => {
  try {
    const nueva = await Sucursal.create(req.body);
    res.json(nueva);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear sucursal', details: err });
  }
});

// Listar sucursales
router.get('/', async (req, res) => {
  try {
    const sucursales = await Sucursal.findAll();
    res.json(sucursales);
  } catch (err) {
    res.status(500).json({ error: 'Error al listar sucursales' });
  }
});

module.exports = router;
