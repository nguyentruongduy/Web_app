const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

// Get user profile
router.get('/profile', 
    authMiddleware, 
    userController.getProfile
);

// Update user profile
router.put('/profile',
    authMiddleware,
    [
        body('name').optional().trim().isLength({ min: 2 }),
        body('phone').optional().trim(),
        body('address').optional().trim()
    ],
    userController.updateProfile
);

// Change password
router.put('/change-password',
    authMiddleware,
    [
        body('currentPassword').exists(),
        body('newPassword').isLength({ min: 6 })
    ],
    userController.changePassword
);

module.exports = router;