const Product = require('./models/Product');
const sequelize = require('./config/database');

(async () => {
  try {
    await sequelize.authenticate();
    const product = await Product.create({
      codigo: 'DEBUG100',
      nombre: 'Producto de depuración',
      descripcion: 'Prueba directa de Sequelize',
      precio: 5000,
      stock: 5,
      categoria: 'Pruebas',
      imagen: '',
      sucursalId: 1
    });
    console.log('Producto creado OK:', product.toJSON());
  } catch (error) {
    console.error('Error al crear producto:', error);
  } finally {
    await sequelize.close();
  }
})();
