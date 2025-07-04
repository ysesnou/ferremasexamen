const Product = require('../models/Product');
const { Op } = require('sequelize');

const validateProductData = (data) => {
  const errors = [];
  if (!data.codigo || data.codigo.trim() === '') {
    errors.push('El campo "codigo" es obligatorio');
  }
  if (!data.nombre || data.nombre.trim() === '') {
    errors.push('El campo "nombre" es obligatorio');
  }
  if (!data.precio || isNaN(data.precio)) {
    errors.push('El campo "precio" es obligatorio y debe ser un número');
  } else if (data.precio <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }
  if (!data.stock || isNaN(data.stock)) {
    errors.push('El campo "stock" es obligatorio y debe ser un número entero');
  } else if (data.stock < 0) {
    errors.push('El stock no puede ser negativo');
  }
  if (!data.categoria || data.categoria.trim() === '') {
    errors.push('El campo "categoria" es obligatorio');
  }
  return errors;
};

exports.getProductByCodigo = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { codigo: req.params.codigo } });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado con ese código' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = {
      codigo: req.body.codigo ? String(req.body.codigo).trim() : null,
      nombre: req.body.nombre ? String(req.body.nombre).trim() : null,
      descripcion: req.body.descripcion ? String(req.body.descripcion).trim() : null,
      precio: Number(req.body.precio),
      stock: Number(req.body.stock),
      categoria: req.body.categoria ? String(req.body.categoria).trim() : null,
      imagen: req.body.imagen ? String(req.body.imagen).trim() : null,
      sucursalId: req.body.sucursalId ? Number(req.body.sucursalId) : null,
      visible: req.body.visible !== undefined ? Boolean(req.body.visible) : true
    };

    // 💡 Log completo para depuración:
    console.log("PRODUCT DATA A GUARDAR:", productData);

    // Validación extrema
    if (
      !productData.codigo ||
      !productData.nombre ||
      isNaN(productData.precio) ||
      isNaN(productData.stock) ||
      !productData.categoria ||
      isNaN(productData.sucursalId)
    ) {
      return res.status(400).json({
        message: 'Validación fallida: Todos los campos obligatorios deben estar presentes y ser válidos'
      });
    }
    console.log("PRODUCT DATA A GUARDAR:", productData);
  
    const product = await Product.create(productData);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      data: product
    });

  } catch (error) {
    console.error('Error en createProduct:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Error: El producto ya existe o hay datos duplicados'
      });
    }

    res.status(500).json({
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      return res.json(updatedProduct);
    }
    throw new Error('Producto no encontrado');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Producto eliminado' });
    }
    throw new Error('Producto no encontrado');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 NUEVO: Buscar productos por categoría
exports.getProductsByCategoria = async (req, res) => {
  const categoria = req.params.categoria;
  try {
    const products = await Product.findAll({
      where: {
        categoria: {
          [Op.like]: `%${categoria}%`
        },
        visible: true
      }
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos en esa categoría' });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 NUEVO: Buscar productos con stock bajo
exports.getProductsWithLowStock = async (req, res) => {
  const min = parseInt(req.query.min) || 10;
  try {
    const products = await Product.findAll({
      where: {
        stock: {
          [Op.lt]: min
        },
        visible: true
      }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ SOLO productos visibles para clientes
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { visible: true }
    });
    res.json(products);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ message: error.message });
  }
};
