const path = require('path');
const webpayService = require(path.join(__dirname, '../services/Js_webpayService'));

exports.createPayment = async (req, res) => {
  try {
    const { amount, buyOrder } = req.body;
    const sessionId = req.user ? req.user._id.toString() : req.sessionID;
    
    const transaction = await webpayService.createTransaction(
      amount,
      buyOrder,
      sessionId
    );
    
    res.json({
      url: transaction.url,
      token: transaction.token,
      success: true
    });
  } catch (error) {
    console.error('Error in createPayment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear pago en WebPay' 
    });
  }
};

exports.paymentResponse = async (req, res) => {
  try {
    const { token } = req.query;
    const result = await webpayService.commitTransaction(token);
    
    // Aquí puedes redirigir a una página de éxito/fracaso según result.status
    if (result.status === 'AUTHORIZED') {
      res.redirect('/payment/success?token=' + token);
    } else {
      res.redirect('/payment/failure?token=' + token);
    }
  } catch (error) {
    console.error('Error in paymentResponse:', error);
    res.redirect('/payment/error');
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { token } = req.params;
    const status = await webpayService.getTransactionStatus(token);
    res.json(status);
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener estado del pago' 
    });
  }
};