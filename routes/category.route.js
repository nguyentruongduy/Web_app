const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { body } = require('express-validator');

// Get all categories (public)
router.get('/', categoryController.getAllCategories);

// Get category by ID (public)
router.get('/:id', categoryController.getCategoryById);

// Create new category (admin only)
router.post('/',
    authMiddleware,
    adminMiddleware,
    [
        body('name').trim().isLength({ min: 2, max: 50 }),
        body('description').trim().isLength({ min: 10, max: 500 })
    ],
    categoryController.createCategory
);

// Update category (admin only)
router.put('/:id',
    authMiddleware,
    adminMiddleware,
    [
        body('name').optional().trim().isLength({ min: 2, max: 50 }),
        body('description').optional().trim().isLength({ min: 10, max: 500 })
    ],
    categoryController.updateCategory
);

// Delete category (admin only)
router.delete('/:id',
    authMiddleware,
    adminMiddleware,
    categoryController.deleteCategory
);

module.exports = router;