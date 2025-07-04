const Mensaje = require('../models/Mensaje');

// POST: Crear mensaje
exports.crearMensaje = async (req, res) => {
  const { nombre_cliente, email_cliente, mensaje } = req.body;

  if (!nombre_cliente || !email_cliente || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const nuevoMensaje = await Mensaje.create({
      nombre_cliente,
      email_cliente,
      mensaje
    });

    res.status(201).json({ message: 'Mensaje enviado correctamente', data: nuevoMensaje });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el mensaje', detalle: error.message });
  }
};

// GET: Listar todos los mensajes
exports.getMensajes = async (req, res) => {
  try {
    const mensajes = await Mensaje.findAll({ order: [['fecha', 'DESC']] });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes', detalle: error.message });
  }
};
