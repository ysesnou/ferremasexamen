document.addEventListener('DOMContentLoaded', function () {
  const webpayButton = document.getElementById('webpay-button');
  const loadingElement = document.getElementById('loading');
  const totalAmountElement = document.getElementById('total-amount');
  const orderSummaryElement = document.getElementById('order-summary');
  const currencySelector = document.getElementById('currency');
  const exchangeRateElement = document.getElementById('exchange-rate');
  const currencySymbolElement = document.getElementById('currency-symbol');

  const orderData = {
    buyOrder: 'ORD-' + Date.now(),
    products: []  // Se cargará dinámicamente
  };

  let exchangeRates = {
    USD: 950,
    EUR: 1050
  };

  function cargarProductosDesdeLocalStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        orderData.products = JSON.parse(cartData);
      } catch (error) {
        console.error('Error al leer el carrito desde localStorage', error);
      }
    } else {
      orderData.products = [];
    }
  }

  function calcularTotal() {
    return orderData.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    if (toCurrency === 'CLP') return amount * exchangeRates[fromCurrency];
    if (fromCurrency === 'CLP') return amount / exchangeRates[toCurrency];
    return amount;
  }

  function formatCurrency(amount, currency) {
    if (currency === 'CLP') return `$${Math.round(amount).toLocaleString('es-CL')}`;
    if (currency === 'USD') return `$${amount.toFixed(2)}`;
    if (currency === 'EUR') return `€${amount.toFixed(2)}`;
    return amount;
  }

  function updateCurrencyDisplay() {
    const selectedCurrency = currencySelector.value;
    currencySymbolElement.textContent = selectedCurrency;

    const total = calcularTotal();

    if (selectedCurrency === 'CLP') {
      exchangeRateElement.textContent = '';
      totalAmountElement.textContent = formatCurrency(total, 'CLP');
    } else {
      const converted = convertCurrency(total, 'CLP', selectedCurrency);
      exchangeRateElement.textContent = `(Tasa: 1 ${selectedCurrency} = ${exchangeRates[selectedCurrency]} CLP)`;
      totalAmountElement.textContent = formatCurrency(converted, selectedCurrency);
    }

    webpayButton.disabled = selectedCurrency !== 'CLP';
  }

  function displayOrderSummary() {
    const selectedCurrency = currencySelector.value;
    let summaryHTML = '';

    orderData.products.forEach((product, index) => {
      const subtotal = product.price * product.quantity;
      const convertedSubtotal = selectedCurrency === 'CLP'
        ? subtotal
        : convertCurrency(subtotal, 'CLP', selectedCurrency);

      summaryHTML += `
        <div class="product-item">
          <span>${product.name} x 
            <input type="number" min="1" value="${product.quantity}" data-index="${index}" class="quantity-input" style="width: 50px;">
          </span>
          <span>${formatCurrency(convertedSubtotal, selectedCurrency)}</span>
        </div>
      `;
    });

    orderSummaryElement.innerHTML = summaryHTML;

    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'));
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0) {
          orderData.products[index].quantity = newQuantity;
          localStorage.setItem('cart', JSON.stringify(orderData.products)); // Guardar cambio
          displayOrderSummary(); // Actualizar
        }
      });
    });

    updateCurrencyDisplay();
  }

  async function iniciarPagoWebpay() {
    try {
      if (currencySelector.value !== 'CLP') {
        alert('WebPay solo acepta pagos en pesos chilenos (CLP)');
        return;
      }

      webpayButton.style.display = 'none';
      loadingElement.style.display = 'block';

      const response = await fetch('http://localhost:3000/api/webpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: calcularTotal(),
          buyOrder: orderData.buyOrder
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar el pago');
      }

      window.location.href = data.url + '?token_ws=' + data.token;

    } catch (error) {
      console.error('Error al iniciar el pago:', error);
      loadingElement.style.display = 'none';
      webpayButton.style.display = 'block';
      alert(`Error al iniciar el pago: ${error.message}`);
    }
  }

  webpayButton.addEventListener('click', iniciarPagoWebpay);
  currencySelector.addEventListener('change', displayOrderSummary);

  cargarProductosDesdeLocalStorage(); // ⬅️ Carga los productos reales
  displayOrderSummary();
});
