const express = require('express');
const router = express.Router();
const { obtenerValorDolar } = require('../services/bcchService');

// Endpoint: obtener valor del dólar
router.get('/dolar', async (req, res) => {
    try {
        const valor = await obtenerValorDolar();
        res.json({ valorDolar: valor });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el valor del dólar" });
    }
});

// Endpoint: CLP a USD
router.get('/clp-to-usd', async (req, res) => {
    const { cantidad } = req.query;
    if (!cantidad || isNaN(cantidad)) {
        return res.status(400).json({ error: "Ingresa una cantidad válida de CLP" });
    }

    try {
        const valor = await obtenerValorDolar();
        const resultado = parseFloat(cantidad) / valor;
        res.json({
            cantidad_clp: parseFloat(cantidad),
            valor_dolar: valor,
            cantidad_usd: resultado.toFixed(2),
            fecha: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: "Error en la conversión" });
    }
});

// Endpoint: USD a CLP
router.get('/usd-to-clp', async (req, res) => {
    const { cantidad } = req.query;
    if (!cantidad || isNaN(cantidad)) {
        return res.status(400).json({ error: "Ingresa una cantidad válida de USD" });
    }

    try {
        const valor = await obtenerValorDolar();
        const resultado = parseFloat(cantidad) * valor;
        res.json({
            cantidad_usd: parseFloat(cantidad),
            valor_dolar: valor,
            cantidad_clp: resultado.toFixed(2),
            fecha: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: "Error en la conversión" });
    }
});

module.exports = router;
