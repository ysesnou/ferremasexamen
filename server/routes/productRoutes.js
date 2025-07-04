const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/Js_authMiddleware'); // Asegúrate que el nombre y ruta coincidan

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/codigo/:codigo', productController.getProductByCodigo);
router.get('/categoria/:categoria', productController.getProductsByCategoria);
router.get('/stock-bajo', productController.getProductsWithLowStock);
module.exports = router;
