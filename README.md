🛠️ Ferremas: Plataforma de Comercio Electrónico para Distribuidora de Ferretería y Construcción
📌 Descripción General
Ferremas es una solución de comercio electrónico desarrollada para modernizar y optimizar las operaciones de la distribuidora "Ferremas", la cual cuenta con presencia en varias regiones de Chile. El sistema tiene como objetivo mejorar la eficiencia operativa, facilitar el proceso de compra a los usuarios finales y permitir la integración con sistemas internos y externos a través de APIs.

📊 Modelo de Negocio y Procesos
Se identificaron y documentaron los cuatro procesos clave:

Gestión de ventas y atención al cliente

Manejo de inventario y bodega

Procesamiento de pagos y contabilidad

Administración general y planificación estratégica

Estos procesos se modelaron con BPMN AS-IS y BPMN TO-BE, incorporando mejoras basadas en la implementación del comercio electrónico.

🧱 Arquitectura y Tecnologías
Lenguaje: Java

Arquitectura: Capas (MVC)

Base de datos: MySQL

Frontend: HTML5, CSS3, JS

Backend: Servlet, JSP

APIs/Webservices:

API Interna para sucursales

API pública para terceros

API de Webpay (pagos)

API Banco Central (conversión de divisas)

## 📁 Estructura del Proyecto

```
Ferremas-main/
├── server/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── routes/
├── pruebas/
│   ├── Ferremas_Plan_Corregido_POST_JSON.jmx
│   └── Plan_de_Pruebas_Ferremas.docx
├── README.md
└── ...
```

## 🚀 Instalacion y Ejecucion

### 1. Clonar repositorio

```bash
git clone https://github.com/usuario/ferremas.git
cd ferremas
```

### 2. Instalar dependencias

```bash
npm install
```

## 3. Asegurar entorno local

- Ejecutar **XAMPP** (MySQL y Apache activos)
- Verificar la base de datos `ferreteria` con tablas como `products`, `sucursales`, `orders`, `mensajes`.

### 4. Iniciar el servidor

```bash
node app.js
```

### 5. Abrir localhost

```bash
http://localhost:3000/login.html
```

---

## 🌐 Endpoints disponibles

| Método | Ruta                          | Descripción                        |
|--------|-------------------------------|------------------------------------|
| GET    | `/api/products`              | Lista de productos                 |
| GET    | `/api/sucursales`           | Lista de sucursales                |
| GET    | `/api/orders`               | Lista de pedidos                   |
| POST   | `/api/mensajes`             | Envío de formulario de contacto    |
| GET    | `/api/currency/rates`       | Tasas de cambio desde mindicador.cl |
| POST   | `/api/currency/convert`     | Conversión entre monedas (USD, EUR, CLP) |

---



👤 Roles del Sistema
Rol	Funciones Clave
Administrador	Crear usuarios, visualizar reportes, gestionar promociones
Vendedor	    Confirmar pedidos, interactuar con bodegueros y clientes
Bodeguero	    Gestionar inventario y entrega
Contador	    Validar pagos y elaborar reportes financieros
Cliente	        Ver catálogo, comprar productos, registrar cuenta

🔍 Pruebas realizadas

🧪 Pruebas unitarias (Postman + Selenium)

Se validaron los endpoints con diferentes parámetros

Validación de errores, respuestas esperadas y formatos

Uso de Selenium con archivo .side para pruebas automatizadas en el flujo de compra (por ejemplo: añadir producto al carrito y simular el pago)

⚙️ Pruebas de carga (JMeter)

Archivo .jmx incluye:

3 endpoints GET

1 endpoint POST (/api/mensajes) con JSON

Headers correctamente configurados (Content-Type: application/json)

🧾 Plan de Pruebas Incluye:
Objetivos y alcance

Casos de prueba por componente

Herramientas utilizadas

Cronograma y responsables

Matriz de riesgos

Criterios de aceptación

Glosario técnico

🔐 Seguridad
Autenticación con roles

Validación de sesiones

Integración segura con Webpay

Sanitización de entradas

🌍 API de Tasas de Cambio: mindicador.cl

 Se utiliza `https://mindicador.cl/api`
 Carga las tasas de USD y EUR → convertidas dinámicamente
Caché de 1 hora para evitar múltiples solicitudes

🌍 API de Webpay Transbank

Documentación: https://transbankdevelopers.cl/docs/webpay

Esta integración permite que, al realizar un pago desde el carro de compras, el usuario sea redirigido a la plataforma segura de Webpay para completar la transacción con tarjetas bancarias de manera segura y verificada.



🧠 Conclusión
El sistema cumple con los requerimientos funcionales y no funcionales de la organización "Ferremas", integrando de forma eficiente procesos clave y tecnologías modernas. Está listo para su despliegue y escalamiento tanto a nivel nacional como internacional.