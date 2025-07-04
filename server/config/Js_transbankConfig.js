require('dotenv').config();
const { Options, WebpayPlus } = require('transbank-sdk');

module.exports = {
  configureWebpay: () => {
    WebpayPlus.configureForIntegration(
      process.env.WEBPAY_COMMERCE_CODE || '597055555532',
      process.env.WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'
    );
    
    return {
      commerceCode: process.env.WEBPAY_COMMERCE_CODE || '597055555532',
      apiKey: process.env.WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
      environment: process.env.WEBPAY_ENVIRONMENT || 'INTEGRATION',
      returnUrl: process.env.WEBPAY_RETURN_URL || 'http://localhost:3000/webpay/response'
    };
  }
};