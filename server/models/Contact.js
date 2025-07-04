// models/Contact.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  nombre_cliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email_cliente: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
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
  tableName: 'mensajes', // 🔁 usa la tabla real
  timestamps: false      // ❌ no uses createdAt/updatedAt automáticos
});

module.exports = Contact;
