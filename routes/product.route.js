const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const isAdminMiddleware = require('../middlewares/admin.middleware');

// Route to get all products
router.get('/', productController.readAllProducts);

// Route to search products
router.get('/search', productController.searchProducts);

// Route to get a product by ID
router.get('/:id', productController.readProductById);

// Route to create a new product (admin only)
router.post(
  '/',
  authMiddleware,
  isAdminMiddleware,
  productController.createProduct
);

// Route to update a product (admin only)
router.put(
  '/:id',
  authMiddleware,
  isAdminMiddleware,
  productController.updateProduct
);

// Route to delete a product (admin only)
router.delete(
  '/:id',
  authMiddleware,
  isAdminMiddleware,
  productController.deleteProduct
);

module.exports = router;