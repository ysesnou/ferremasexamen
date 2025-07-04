const axios = require('axios');

// Obtener valor del dólar desde el Banco Central de Chile
async function obtenerValorDolar() {
    const response = await axios.get(
        "https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx",
        {
            params: {
                user: "darklinkshiny@gmail.com",
                pass: "Joaco0608",
                firstdate: new Date().toISOString().split('T')[0],
                lastdate: new Date().toISOString().split('T')[0],
                timeseries: "F073.TCO.PRE.Z.D",
                function: "GetSeries"
            }
        }
    );
    return parseFloat(response.data.Series.Obs[0].value);
}

module.exports = {
    obtenerValorDolar
};
