const axios = require('axios');

let ratesCache = {
  lastUpdated: null,
  data: null
};

const CACHE_TTL = 3600000; // 1 hora

async function getExchangeRates() {
  const now = new Date();
  if (!ratesCache.data || now - ratesCache.lastUpdated > CACHE_TTL) {
    const response = await axios.get(process.env.BCCH_API_URL);
    ratesCache.data = {
      USD: response.data.dolar.valor,
      EUR: response.data.euro.valor,
      lastUpdated: new Date(response.data.dolar.fecha)
    };
    ratesCache.lastUpdated = now;
  }
  return ratesCache.data;
}

module.exports = { getExchangeRates };
