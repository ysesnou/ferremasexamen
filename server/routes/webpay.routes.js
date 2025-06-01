const express = require('express');
const router = express.Router();
const { WebpayPlus, Options } = require('transbank-sdk');

// Configuración en MODO PRUEBA
WebpayPlus.configureForIntegration(
  '597055555532', // Código de comercio de prueba
  'https://webpay3g.transbank.cl',
  '597055555532' // Mismo commerceCode como API Key
);

// Ruta para crear una transacción
router.post('/create-transaction', async (req, res) => {
  try {
    const { buyOrder, sessionId, amount, returnUrl } = req.body;

    // Validar parámetros requeridos
    if (!buyOrder || !sessionId || !amount || !returnUrl) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Crear transacción
    const response = await new WebpayPlus.Transaction().create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    res.status(200).json({
      token: response.token,
      url: response.url
    });

  } catch (err) {
    console.error('Error al crear transacción:', err.message);
    res.status(500).json({ error: 'Error creando transacción' });
  }
});

// Ruta para confirmar transacción
router.post('/commit', async (req, res) => {
  const { token_ws } = req.body;

  if (!token_ws) {
    return res.status(400).json({ error: 'token_ws es requerido' });
  }

  try {
    const result = await new WebpayPlus.Transaction().commit(token_ws);

    // Aquí puedes guardar los datos en tu base o registrar el pago
    console.log('Pago confirmado:', result);

    res.status(200).json({
      message: 'Transacción completada',
      status: result.status,
      amount: result.amount,
      buyOrder: result.buy_order,
      cardDetail: result.card_detail,
      authorizationCode: result.authorization_code
    });
  } catch (error) {
    console.error('Error al confirmar transacción:', error.message);
    res.status(500).json({ error: 'Error al confirmar transacción' });
  }
});

// (Opcional) Ver estado de una transacción por token
router.get('/status/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const response = await new WebpayPlus.Transaction().status(token);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error obteniendo estado:', error.message);
    res.status(500).json({ error: 'No se pudo obtener estado de transacción' });
  }
});

module.exports = router;
