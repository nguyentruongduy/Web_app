const Review = require('../models/review.model');
const { validationResult } = require('express-validator');

exports.createReview = async (req, res) => {
    console.log('Received data for createReview:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        const review = new Review({
            productId,
            userId,
            rating,
            comment
        });

        await review.save();
        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ 
            productId: req.params.productId,
            status: 'approved'
        })
        .populate('userId', 'name');
        
        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user._id })
            .populate('productId');
        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateReview = async (req, res) => {
    console.log('Received data for updateReview:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const review = await Review.findOne({ 
            _id: req.params.id,
            userId: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (req.body.rating) review.rating = req.body.rating;
        if (req.body.comment) review.comment = req.body.comment;
        review.status = 'pending'; // Reset status for re-moderation

        await review.save();
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.moderateReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review moderated successfully', review });
    } catch (error) {
        console.error('Error moderating review:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('productId', 'name image')
            .populate('userId', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching all reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};