const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { body } = require('express-validator');

// Create a new review
router.post('/',
    authMiddleware,
    [
        body('productId').isMongoId(),
        body('rating').isInt({ min: 1, max: 5 }),
        body('comment').isString().trim().isLength({ min: 1, max: 500 })
    ],
    reviewController.createReview
);

// Get all reviews for admin
router.get('/',
    authMiddleware,
    adminMiddleware,
    reviewController.getAllReviews
);

// Get all reviews for a product
router.get('/product/:productId',
    reviewController.getProductReviews
);

// Get user's reviews
router.get('/my-reviews',
    authMiddleware,
    reviewController.getUserReviews
);

// Update review
router.put('/:id',
    authMiddleware,
    [
        body('rating').optional().isInt({ min: 1, max: 5 }),
        body('comment').optional().isString().trim().isLength({ min: 3, max: 500 })
    ],
    reviewController.updateReview
);

// Delete review
router.delete('/:id',
    authMiddleware,
    reviewController.deleteReview
);

// Moderate review (admin only)
router.patch('/:id/moderate',
    authMiddleware,
    adminMiddleware,
    body('status').isIn(['approved', 'pending', 'rejected']),
    reviewController.moderateReview
);

module.exports = router;