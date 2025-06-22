const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { body } = require('express-validator');

// Dashboard
router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboard);

// Product routes
router.get('/products', authMiddleware, adminMiddleware, adminController.getProducts);
router.post('/products', 
    authMiddleware, 
    adminMiddleware,
    [
        body('name').trim().isLength({ min: 2 }),
        body('price').isFloat({ min: 0 }),
        body('description').trim().isLength({ min: 10 })
    ],
    adminController.createProduct
);
router.put('/products/:id', authMiddleware, adminMiddleware, adminController.updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, adminController.deleteProduct);

// Order routes
router.get('/orders', authMiddleware, adminMiddleware, adminController.getOrders);
router.patch('/orders/:id/status', 
    authMiddleware, 
    adminMiddleware,
    body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    adminController.updateOrderStatus
);

// User routes
router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.patch('/users/:id/status', authMiddleware, adminMiddleware, adminController.updateUserStatus);

// Review routes
router.get('/reviews', authMiddleware, adminMiddleware, adminController.getReviews);
router.patch('/reviews/:id/moderate', 
    authMiddleware, 
    adminMiddleware,
    body('status').isIn(['approved', 'pending', 'rejected']),
    adminController.moderateReview
);

// Analytics route
router.get('/analytics', authMiddleware, adminMiddleware, adminController.getAnalytics);

module.exports = router;