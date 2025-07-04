// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    await Contact.create({
      nombre_cliente: nombre,
      email_cliente: correo,
      mensaje
    });

    res.status(201).json({ message: 'Mensaje recibido correctamente' });
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;

