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


// Controlador con validaciones mejoradas
exports.createProduct = async (req, res) => {
  try {
    const validationErrors = validateProductData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Error de validación',
        errors: validationErrors 
      });
    }

    const productData = {
      codigo: req.body.codigo?.trim(),
      nombre: req.body.nombre.trim(),
      descripcion: req.body.descripcion?.trim() || null,
      precio: parseFloat(req.body.precio),
      stock: parseInt(req.body.stock),
      categoria: req.body.categoria.trim(),  // corregido aquí
      imagen: req.body.imagen?.trim() || null,
      sucursalId: req.body.sucursalId // asegúrate de enviarlo también
    };

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

exports.getAllProducts = async (req, res) => {
  try {
    const { name, category, stock, page = 1, limit = 10, sort } = req.query;

    const whereClause = {};

    if (name) {
      whereClause.nombre = { [Op.like]: `%${name}%` };
    }

    if (category) {
      whereClause.categoria = category;
    }

    if (stock) {
      whereClause.stock = { [Op.lt]: parseInt(stock) };
    }

    // Ordenamiento dinámico
    let order = [];
    if (sort) {
      const [field, direction] = sort.split('_');
      const validFields = ['precio', 'stock'];
      const validDirections = ['asc', 'desc'];

      if (validFields.includes(field) && validDirections.includes(direction)) {
        order = [[field, direction.toUpperCase()]];
      }
    }

    // Paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.findAll({
      where: whereClause,
      order,
      offset,
      limit: parseInt(limit)
    });

    res.json(products);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
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
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
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