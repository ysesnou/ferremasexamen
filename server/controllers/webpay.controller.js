// controllers/webpay.controller.js
const webpay = require('../config/transbankConfig');

exports.initTransaction = async (req, res) => {
  try {
    const { buyOrder, sessionId, amount, returnUrl } = req.body;
    const response = await webpay.create(buyOrder, sessionId, amount, returnUrl);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error creando transacción' });
  }
};

exports.commitTransaction = async (req, res) => {
  try {
    const { token_ws } = req.body;
    const response = await webpay.commit(token_ws);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error confirmando transacción' });
  }
};
