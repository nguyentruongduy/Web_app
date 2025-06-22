const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { body, param } = require('express-validator');

// Route to get all carts (admin only)
router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  cartController.getCart
);

// Route to get cart statistics (admin only)
router.get(
  '/statistics',
  authMiddleware,
  adminMiddleware,
  cartController.getCartStatistics
);

// Route to get user cart (user only)
router.get(
  '/user',
  authMiddleware,
  cartController.getUserCart
);

// Route to get a cart by ID (user only)
router.get(
  '/:id',
  authMiddleware,
  cartController.getCartById
);

// Route to create a new cart (user only)
router.post(
  '/',
  authMiddleware,
  cartController.addToCart
);

// Route to update a cart (user only)
router.put(
  '/:id',
  authMiddleware,
  cartController.updateCartItem
);

// Route to delete a cart (user only)
router.delete(
  '/:id',
  authMiddleware,
  cartController.removeProductFromCart
);

// Route to remove a product from a cart (user only)
router.delete(
  '/:id/products/:productId',
  authMiddleware,
  cartController.removeProductFromCart
);

// Route to clear a cart (user only)
router.delete(
  '/:id/clear',
  authMiddleware,
  cartController.clearCart
);  

module.exports = router;
