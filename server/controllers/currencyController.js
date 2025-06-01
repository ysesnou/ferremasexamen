const axios = require('axios');

// Cache para almacenar tasas (evita consultas repetidas)
let ratesCache = {
  lastUpdated: null,
  data: null
};

const CACHE_TTL = 3600000; // 1 hora en milisegundos

// Obtiene tasas desde Mindicador.cl
async function fetchExchangeRates() {
  try {
    const response = await axios.get('https://mindicador.cl/api');
    return {
      USD: response.data.dolar.valor,
      EUR: response.data.euro.valor,
      lastUpdated: new Date(response.data.dolar.fecha)
    };
  } catch (error) {
    throw new Error('Error al obtener tasas desde Mindicador.cl');
  }
}

// Obtiene tasas con cache
async function getExchangeRates() {
  const now = new Date();
  if (!ratesCache.data || now - ratesCache.lastUpdated > CACHE_TTL) {
    ratesCache.data = await fetchExchangeRates();
    ratesCache.lastUpdated = now;
  }
  return ratesCache.data;
}

// Convierte entre monedas
async function convertCurrency(amount, fromCurrency, toCurrency) {
  const rates = await getExchangeRates();
  const validCurrencies = ['USD', 'EUR', 'CLP'];

  if (!validCurrencies.includes(fromCurrency) || !validCurrencies.includes(toCurrency)) {
    throw new Error('Moneda no soportada. Use USD, EUR o CLP');
  }

  // Convertir todo a CLP primero
  const ratesToCLP = {
    USD: rates.USD,
    EUR: rates.EUR,
    CLP: 1
  };

  const amountInCLP = amount * ratesToCLP[fromCurrency];
  const convertedAmount = amountInCLP / ratesToCLP[toCurrency];

  return {
    originalAmount: amount,
    fromCurrency,
    toCurrency,
    exchangeRate: ratesToCLP[fromCurrency] / ratesToCLP[toCurrency],
    convertedAmount: parseFloat(convertedAmount.toFixed(2)),
    lastUpdated: rates.lastUpdated
  };
}

module.exports = {
  getExchangeRates,
  convertCurrency
};