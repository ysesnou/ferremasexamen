const express = require('express');
const router = express.Router();
const { getExchangeRates, convertCurrency } = require('../controllers/currencyController');

// GET /api/currency/rates
router.get('/rates', async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/currency/convert
router.post('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.body;
    const result = await convertCurrency(amount, from, to);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;