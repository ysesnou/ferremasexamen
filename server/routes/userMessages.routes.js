// 📁 server/routes/userMessages.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/Js_authMiddleware');
const db = require('../config/database');

// Crear mensaje asociado al usuario logueado
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { mensaje } = req.body;
    const userId = req.user.id;

    if (!mensaje) return res.status(400).json({ error: 'Mensaje requerido' });

    await db.execute(
      'INSERT INTO mensajes (nombre_cliente, email_cliente, mensaje, fecha) VALUES (?, ?, ?, NOW())',
      [req.user.email.split('@')[0], req.user.email, mensaje]
    );

    res.status(201).json({ message: 'Mensaje enviado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

// Obtener mensajes del usuario autenticado (filtrado por su email)
router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM mensajes WHERE email_cliente = ?',
      [req.user.email]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

module.exports = router;
