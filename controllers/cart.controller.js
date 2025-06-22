const Cart = require('../models/cart.model');
const { validationResult } = require('express-validator');
const { ObjectId } = require('mongoose').Types;
const Product = require('../models/product.model');
const User = require('../models/user.model');

exports.addToCart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity } = req.body;
    const userId = req.user._id;

    try {
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Check if product is already in the cart
        const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        
        if (existingProductIndex > -1) {
            // Update quantity if product already exists in the cart
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Add new product to the cart
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        
        res.status(200).json({ message: 'Product added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all carts (admin)
exports.getCart = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.productId');
        res.status(200).json({ message: 'Cart fetched successfully', carts });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a cart by ID (admin/user)
exports.getCartById = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const cartId = req.params.id;
    if (!ObjectId.isValid(cartId)) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }
    try {
        const cart = await Cart.findById(cartId).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ message: 'Cart fetched successfully', cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a cart item
exports.updateCartItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const cartId = req.params.id;
    const { productId, quantity } = req.body;
    if (!ObjectId.isValid(cartId)) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        // Update the quantity of the product in the cart
        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.status(200).json({ message: 'Cart item updated successfully', cart });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a cart item
exports.removeProductFromCart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const cartId = req.params.id;
    const productId = req.params.productId;
    if (!ObjectId.isValid(cartId)) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }
        // Remove the product from the cart
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.status(200).json({ message: 'Product removed from cart successfully', cart });
    }
    catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Clear the cart
exports.clearCart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const cartId = req.params.id;
    if (!ObjectId.isValid(cartId)) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Clear the cart
        cart.products = [];
        await cart.save();
        res.status(200).json({ message: 'Cart cleared successfully', cart });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Get user's cart
exports.getUserCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId })
            .populate({ path: 'products.productId', select: 'name description price stock image' });
        if (!cart) {
            // Nếu chưa có cart, tạo mới cho user
            const newCart = new Cart({ userId, products: [] });
            await newCart.save();
            console.log('Cart created for user', JSON.stringify(newCart, null, 2));
            return res.status(200).json({ message: 'Cart created for user', data: newCart });
        }
        console.log('Cart fetched from DB (after populate):', JSON.stringify(cart, null, 2));
        res.status(200).json({ message: 'Cart fetched successfully', data: cart });
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get cart statistics
exports.getCartStatistics = async (req, res) => {
    try {
        const stats = await Cart.aggregate([
            {
                $group: {
                    _id: null,
                    totalCarts: { $sum: 1 },
                    averageProducts: { $avg: { $size: "$products" } }
                }
            }
        ]);
        res.status(200).json({ message: 'Cart statistics fetched successfully', stats: stats[0] });
    } catch (error) {
        console.error('Error fetching cart statistics:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


