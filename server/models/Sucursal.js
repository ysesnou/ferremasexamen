const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sucursal = sequelize.define('Sucursales', {  // Modelo en singular
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion',
  tableName: 'sucursales', // nombre tabla en plural
  // Eliminé los hooks porque Sequelize actualiza automáticamente
});

// Método personalizado para formatear fechas antes de enviar respuesta
Sucursal.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());

  if (values.fechaCreacion) {
    values.fechaCreacion = values.fechaCreacion.toISOString();
  }
  if (values.fechaActualizacion) {
    values.fechaActualizacion = values.fechaActualizacion.toISOString();
  }

  return values;
};

module.exports = Sucursal;
