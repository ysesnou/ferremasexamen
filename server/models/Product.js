const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Sucursal = require('./Sucursal');


const Product = sequelize.define('Product', {
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imagen: {
    type: DataTypes.STRING
  },
  sucursalId: {
  type: DataTypes.INTEGER,
  allowNull: false
},

}, {
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

Sucursal.hasMany(Product, { foreignKey: 'sucursalId' });
Product.belongsTo(Sucursal, { foreignKey: 'sucursalId' });

module.exports = Product;
