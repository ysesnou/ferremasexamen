// routes/mensajes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/', async (req, res) => {
  const { nombre_cliente, email_cliente, mensaje } = req.body;

  if (!nombre_cliente || !email_cliente || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO mensajes (nombre_cliente, email_cliente, mensaje, fecha) VALUES (?, ?, ?, NOW())',
      [nombre_cliente, email_cliente, mensaje]
    );
    res.status(201).json({ message: 'Mensaje recibido correctamente' });
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    res.status(500).json({ error: 'Error interno al guardar mensaje' });
  }
});

module.exports = router;
