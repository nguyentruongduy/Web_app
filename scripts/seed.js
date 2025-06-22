const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Mongoose models
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_db_dev';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const transformData = (items) => {
    return items.map(item => {
        const transformedItem = { ...item };
        
        // Transform _id from MongoDB Extended JSON format
        if (item._id && item._id.$oid) {
            transformedItem._id = item._id.$oid;
        }

        // Transform category ObjectId in products
        if (item.category && item.category.$oid) {
            transformedItem.category = item.category.$oid;
        }

        // Transform dates from MongoDB Extended JSON format
        if (item.createdAt && item.createdAt.$date) {
            transformedItem.createdAt = new Date(item.createdAt.$date);
        }
        if (item.updatedAt && item.updatedAt.$date) {
            transformedItem.updatedAt = new Date(item.updatedAt.$date);
        }
        
        // Remove __v field as it's managed by Mongoose
        delete transformedItem.__v;
        
        return transformedItem;
    });
};

const importData = async () => {
    try {
        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();

        // Drop all indexes to avoid duplicate key errors
        console.log('Dropping existing indexes...');
        await User.collection.dropIndexes();
        await Category.collection.dropIndexes();
        await Product.collection.dropIndexes();

        console.log('Data cleared...');

        // Check if JSON files exist
        const usersPath = path.join(__dirname, 'users.json');
        const categoriesPath = path.join(__dirname, 'categories.json');
        const productsPath = path.join(__dirname, 'products.json');

        if (!fs.existsSync(usersPath)) {
            throw new Error('users.json not found');
        }
        if (!fs.existsSync(categoriesPath)) {
            throw new Error('categories.json not found');
        }
        if (!fs.existsSync(productsPath)) {
            throw new Error('products.json not found');
        }

        // Read and transform JSON files
        console.log('Reading JSON files...');
        const users = transformData(JSON.parse(fs.readFileSync(usersPath, 'utf-8')));
        const categories = transformData(JSON.parse(fs.readFileSync(categoriesPath, 'utf-8')));
        const products = transformData(JSON.parse(fs.readFileSync(productsPath, 'utf-8')));

        console.log(`Found ${users.length} users, ${categories.length} categories, ${products.length} products`);

        // Import new data
        console.log('Importing users...');
        await User.insertMany(users);
        
        console.log('Importing categories...');
        await Category.insertMany(categories);
        
        console.log('Importing products...');
        await Product.insertMany(products);
        
        console.log('Data imported successfully!');
        console.log(`- ${users.length} users imported`);
        console.log(`- ${categories.length} categories imported`);
        console.log(`- ${products.length} products imported`);
        
        process.exit(0);
    } catch (err) {
        console.error('Error during data import:', err);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();
        console.log('Data destroyed!');
        process.exit(0);
    } catch (err) {
        console.error('Error destroying data:', err);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();

    if (process.argv[2] === '-d') {
        await destroyData();
    } else {
        await importData();
    }
}

run(); 