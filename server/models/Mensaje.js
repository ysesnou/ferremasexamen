const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta según tu conexión

const Mensaje = sequelize.define('Mensaje', {
  nombre_cliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email_cliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'mensajes',
  timestamps: false
});

module.exports = Mensaje;
