const express = require('express');
const router = express.Router();
const { WebpayPlus } = require('transbank-sdk');

// Configurar el entorno: usa `integration` para pruebas
const webpay = new WebpayPlus.Transaction();

router.post('/create', async (req, res) => {
  try {
    const { amount, buyOrder } = req.body;

    // URL de retorno después del pago
    const returnUrl = 'http://localhost:3000/api/webpay/commit';

    const response = await webpay.create(buyOrder, buyOrder, amount, returnUrl);

    // Envía la URL para redirigir al cliente a WebPay
    res.json({
      token: response.token,
      url: response.url,
    });

  } catch (error) {
    console.error('Error al crear pago WebPay:', error);
    res.status(500).json({ message: 'Error al crear pago en WebPay' });
  }
});

router.post('/commit', async (req, res) => {
  try {
    const { token_ws } = req.body;

    const response = await webpay.commit(token_ws);

    // Aquí puedes guardar en tu base de datos la confirmación de pago

    res.json({
      status: 'success',
      detail: response,
    });
  } catch (error) {
    console.error('Error al confirmar pago WebPay:', error);
    res.status(500).json({ message: 'Error al confirmar pago en WebPay' });
  }
});

module.exports = router;
