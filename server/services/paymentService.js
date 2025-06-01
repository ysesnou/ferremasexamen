const { Options, WebpayPlus } = require('transbank-sdk');

// Configuración para ambiente de prueba
const tx = new WebpayPlus.Transaction(new Options(
  process.env.WEBPAY_COMMERCE_CODE || '597055555532',
  process.env.WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  'TEST'
));

exports.createTransaction = async (amount, buyOrder, sessionId, returnUrl) => {
  try {
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);
    return response;
  } catch (error) {
    console.error('Error al crear transacción Webpay:', error);
    throw error;
  }
};

exports.commitTransaction = async (token) => {
  try {
    const response = await tx.commit(token);
    return response;
  } catch (error) {
    console.error('Error al confirmar transacción Webpay:', error);
    throw error;
  }
};