const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { body } = require('express-validator');

// Create new order
router.post('/', 
    authMiddleware,
    [
        body('items').isArray().withMessage('Items must be an array'),
        body('items.*.productId').isMongoId().withMessage('Product ID is invalid'),
        body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
        body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

        body('shippingAddress').isObject().withMessage('Shipping address must be an object'),
        body('shippingAddress.street').notEmpty().withMessage('Street is required').trim(),
        body('shippingAddress.city').notEmpty().withMessage('City is required').trim(),
        body('shippingAddress.state').notEmpty().withMessage('State is required').trim(),
        body('shippingAddress.zipCode').notEmpty().withMessage('Zip code is required').trim(),
        body('shippingAddress.country').notEmpty().withMessage('Country is required').trim(),

        body('paymentMethod').isIn(['COD', 'paypal', 'credit_card']).withMessage('Invalid payment method')
    ],
    orderController.createOrder
);

// Get all orders (admin only)
router.get('/', 
    authMiddleware, 
    adminMiddleware, 
    orderController.getAllOrders
);

// Get user's orders
router.get('/my-orders', 
    authMiddleware, 
    orderController.getUserOrders
);

// Get order by ID
router.get('/:id', 
    authMiddleware, 
    orderController.getOrderById
);

// Update order status (admin only)
router.patch('/:id/status',
    authMiddleware,
    adminMiddleware,
    body('status').isIn(['pending', 'shipped', 'delivered', 'cancelled']),
    orderController.updateOrderStatus
);

// Cancel order
router.patch('/:id/cancel',
    authMiddleware,
    orderController.cancelOrder
);

module.exports = router;