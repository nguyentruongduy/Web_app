const mongoose = require('mongoose');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Review = require('../models/review.model');
const Category = require('../models/category.model');
const { validationResult } = require('express-validator');

// Dashboard
exports.getDashboard = async (req, res) => {
    try {
        const stats = {
            totalOrders: await Order.countDocuments(),
            totalUsers: await User.countDocuments(),
            totalProducts: await Product.countDocuments(),
            pendingReviews: await Review.countDocuments({ status: 'pending' }),
            recentOrders: await Order.find().sort({ createdAt: -1 }).limit(5),
            topProducts: await Product.find().sort({ soldCount: -1 }).limit(5)
        };
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};

// Product management
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

exports.updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// Order management
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};

// User management
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User status updated', user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
};

// Review management
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('userId', 'name')
            .populate('productId', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews' });
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
        res.status(500).json({ message: 'Error moderating review' });
    }
};

// Analytics
exports.getAnalytics = async (req, res) => {
    try {
        const analytics = {
            salesByMonth: await Order.aggregate([
                {
                    $group: {
                        _id: { 
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        totalSales: { $sum: "$totalAmount" }
                    }
                }
            ]),
            topCategories: await Order.aggregate([
                {
                    $unwind: "$items"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "items.productId",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $group: {
                        _id: "$product.category",
                        totalSales: { $sum: "$items.quantity" }
                    }
                }
            ])
        };
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics' });
    }
};