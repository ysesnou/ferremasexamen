document.getElementById('pagarBtn').addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/webpay/create-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buy_order: 'orden123',
        session_id: 'session123',
        amount: 1000,
        return_url: 'http://localhost:3000/api/webpay/commit'
      })
    });

    const result = await response.json();

    if (result.url && result.token) {
      // Redirige al formulario de Webpay en modo sandbox
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = result.url;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = result.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();
    } else {
      alert('Error: No se recibió token de Webpay');
    }
  } catch (err) {
    console.error('Error al crear transacción:', err);
    alert('Error al procesar el pago');
  }
});
