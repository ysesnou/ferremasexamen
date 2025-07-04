const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'id' },
  nombre: { type: DataTypes.STRING(255), allowNull: false, field: 'nombre' },
  descripcion: { type: DataTypes.TEXT, allowNull: true, field: 'descripcion' },
  precio: { type: DataTypes.FLOAT, allowNull: false, field: 'precio' },
  stock: { type: DataTypes.INTEGER, allowNull: false, field: 'stock' },
  categoria: { type: DataTypes.STRING(255), allowNull: false, field: 'categoria' },
  imagen: { type: DataTypes.STRING(255), allowNull: true, field: 'imagen' },
  codigo: { type: DataTypes.STRING(255), allowNull: false, unique: true, field: 'codigo' },
  sucursalId: { type: DataTypes.INTEGER, allowNull: true, field: 'sucursal_id' },
  fechaCreacion: { type: DataTypes.DATE, allowNull: false, field: 'fecha_creacion' },
  fechaActualizacion: { type: DataTypes.DATE, allowNull: false, field: 'fecha_actualizacion' },
  visible: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'visible' }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

module.exports = Product;
