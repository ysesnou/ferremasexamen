const axios = require('axios');

const getExchangeRate = async () => {
  try {
    // Para propósitos académicos, devolvemos valores simulados
    return {
      USD: 0.0012,  // 1 CLP = 0.0012 USD
      EUR: 0.0011,  // 1 CLP = 0.0011 EUR
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error al obtener tasas de cambio:', error);
    throw error;
  }
};

module.exports = { getExchangeRate };