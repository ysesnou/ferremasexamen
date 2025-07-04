const { webpayService } = require('../services/JS_webpayService');
const { WebpayPlus } = require('transbank-sdk');

describe('Webpay Integration Tests', () => {
  let testToken;
  
  it('should create a transaction', async () => {
    const result = await webpayService.createTransaction(
      1000, // $1.000 CLP
      'TEST-' + Date.now(),
      'test-session'
    );
    
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('url');
    testToken = result.token;
  });
  
  it('should commit a transaction', async () => {
    // Esto simula el commit, en realidad WebPay llama a tu endpoint
    const result = await webpayService.commitTransaction(testToken);
    expect(result.status).toBe('AUTHORIZED');
  });
});