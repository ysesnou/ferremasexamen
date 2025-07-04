document.addEventListener('DOMContentLoaded', async () => {
  let carrito = [];

  // Cargar productos
  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const productos = await response.json();
      mostrarProductos(productos);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  // Mostrar productos en el DOM
  const mostrarProductos = (productos) => {
    const productosContainer = document.getElementById('productos');
    productosContainer.innerHTML = '';

    productos.forEach(producto => {
      const productoHTML = `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">${producto.descripcion || 'Sin descripción'}</p>
              <p class="card-text precio" data-precio-clp="${producto.precio}">$${producto.precio} CLP</p>
              <button class="btn btn-sm btn-primary agregar-carrito" data-id="${producto.id}">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      `;
      productosContainer.innerHTML += productoHTML;
    });

    // Agregar event listeners a los botones
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
      boton.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const producto = productos.find(p => p.id === id);
        agregarAlCarrito(producto);
      });
    });
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
  };

  // Actualizar visualización del carrito
  const actualizarCarrito = () => {
    const carritoContainer = document.getElementById('carrito');

    if (carrito.length === 0) {
      carritoContainer.innerHTML = '<p>No hay productos en el carrito</p>';
      document.getElementById('total').textContent = 'Total: $0 CLP';
      return;
    }

    let html = '<ul class="list-unstyled">';
    let total = 0;

    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;

      html += `
        <li class="mb-2 d-flex justify-content-between align-items-center">
          <span>${item.nombre} x${item.cantidad}</span>
          <span>$${subtotal} CLP</span>
        </li>
      `;
    });

    html += '</ul>';
    carritoContainer.innerHTML = html;
    document.getElementById('total').textContent = `Total: $${total} CLP`;
  };

  // Selector de moneda
  document.getElementById('moneda').addEventListener('change', async (e) => {
    const moneda = e.target.value;

    try {
      const response = await fetch('http://localhost:3000/api/exchange');
      const rates = await response.json();

      document.querySelectorAll('.precio').forEach(elemento => {
        const precioCLP = parseFloat(elemento.getAttribute('data-precio-clp'));
        let precioConvertido = precioCLP;
        let simbolo = '$';

        if (moneda === 'USD') {
          precioConvertido = precioCLP * rates.USD;
          simbolo = 'US$';
        } else if (moneda === 'EUR') {
          precioConvertido = precioCLP * rates.EUR;
          simbolo = '€';
        }

        elemento.textContent = `${simbolo}${precioConvertido.toFixed(2)} ${moneda}`;
      });

      // Actualizar total en carrito
      const totalElement = document.getElementById('total');
      if (carrito.length > 0) {
        const totalCLP = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        let totalConvertido = totalCLP;
        let simboloTotal = '$';

        if (moneda === 'USD') {
          totalConvertido = totalCLP * rates.USD;
          simboloTotal = 'US$';
        } else if (moneda === 'EUR') {
          totalConvertido = totalCLP * rates.EUR;
          simboloTotal = '€';
        }

        totalElement.textContent = `Total: ${simboloTotal}${totalConvertido.toFixed(2)} ${moneda}`;
      }
    } catch (error) {
      console.error('Error al convertir moneda:', error);
    }
  });

  // Botón de pago con Webpay
  document.getElementById('pagar').addEventListener('click', async () => {
    if (carrito.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    try {
      const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      const buyOrder = 'BO-' + Date.now();
      const sessionId = 'SID-' + Math.random().toString(36).substring(2);
      const returnUrl = 'http://localhost:3000/pago-exitoso'; // Debe existir esta página

      const response = await fetch('http://localhost:3000/api/webpay/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: total,
          buyOrder,
          sessionId,
          returnUrl
        })
      });

      const data = await response.json();

      if (data.url && data.token) {
        // Redirigir a Webpay
        window.location.href = data.url + '?token_ws=' + data.token;
      } else {
        alert('Error al iniciar el pago');
      }
    } catch (error) {
      console.error('Error en el pago:', error);
      alert('Error al procesar el pago');
    }
  });

  // Inicializar
  await cargarProductos();
});
