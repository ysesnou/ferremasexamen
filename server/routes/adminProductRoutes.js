const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET TODOS (admin, para listar todos)
router.get('/', async (req, res) => {
  try {
    const productos = await Product.findAll();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// CREAR
router.post('/', async (req, res) => {
  try {
    const nuevo = await Product.create(req.body);
    res.status(201).json({ message: 'Producto agregado correctamente', producto: nuevo });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar producto' });
  }
});

// ACTUALIZAR
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      return res.json({ message: 'Producto actualizado', producto: updatedProduct });
    }
    res.status(404).json({ message: 'Producto no encontrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
});

// ELIMINAR
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (deleted) {
      return res.json({ message: 'Producto eliminado' });
    }
    res.status(404).json({ message: 'Producto no encontrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

// OCULTAR
router.patch('/:id/ocultar', async (req, res) => {
  try {
    const [updated] = await Product.update({ visible: false }, { where: { id: req.params.id } });
    if (updated) {
      return res.json({ message: 'Producto ocultado correctamente' });
    }
    res.status(404).json({ message: 'Producto no encontrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al ocultar producto' });
  }
});

// MOSTRAR (rehabilitar)
router.patch('/:id/mostrar', async (req, res) => {
  try {
    const [updated] = await Product.update({ visible: true }, { where: { id: req.params.id } });
    if (updated) {
      return res.json({ message: 'Producto mostrado correctamente' });
    }
    res.status(404).json({ message: 'Producto no encontrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al mostrar producto' });
  }
});

module.exports = router;
