const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WebpayTransaction = sequelize.define('WebpayTransaction', {
  token: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  buy_order: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  session_id: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'created'
  },
  response_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'webpay_transactions',
  timestamps: true
});

module.exports = WebpayTransaction;