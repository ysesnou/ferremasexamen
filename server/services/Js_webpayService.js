const { WebpayPlus } = require('transbank-sdk');
const transbankConfig = require('../config/Js_transbankConfig');
const WebpayTransaction = require('../models/Js_WebpayTransaction');

class WebpayService {
  async createTransaction(amount, buyOrder, sessionId) {
    try {
      // Crear transacción en Transbank
      const response = await WebpayPlus.Transaction.create(
        buyOrder,
        sessionId,
        amount,
        transbankConfig.returnUrl
      );
      
      // Guardar en la base de datos
      await WebpayTransaction.create({
        token: response.token,
        buy_order: buyOrder,
        amount,
        session_id: sessionId,
        status: 'created'
      });
      
      return response;
    } catch (error) {
      console.error('Error creating Webpay transaction:', error);
      throw error;
    }
  }

  async commitTransaction(token) {
    try {
      // Confirmar transacción con Transbank
      const response = await WebpayPlus.Transaction.commit(token);
      
      // Actualizar en la base de datos
      await WebpayTransaction.update({
        status: response.status,
        response_code: response.response_code
      }, {
        where: { token }
      });
      
      return response;
    } catch (error) {
      console.error('Error committing transaction:', error);
      throw error;
    }
  }
}

module.exports = new WebpayService();