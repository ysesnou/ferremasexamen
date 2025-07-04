const express = require('express');
const router = express.Router();
const { WebpayPlus } = require('transbank-sdk');

// Configurar credenciales de integración
WebpayPlus.configureForIntegration(
    '597055555532', // Código de comercio de prueba
    '597055555532', // Código de comercio también va como API key en integración
);

// Ruta para crear la transacción
router.post('/create', async (req, res) => {
    try {
        const { amount, buyOrder } = req.body;

        const sessionId = 'session-' + Date.now(); // puede ser cualquier string
        const returnUrl = 'http://localhost:3000/pago-exitoso';

        const response = await WebpayPlus.Transaction.create(
            buyOrder,
            sessionId,
            amount,
            returnUrl
        );

        console.log('Respuesta de WebPay:', response);
        return res.status(200).json({ url: response.url, token: response.token });
    } catch (error) {
        console.error('Error al crear pago en WebPay:', error);
        return res.status(500).json({ message: 'Error al crear pago en WebPay' });
    }
});

module.exports = router;
