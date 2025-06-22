const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const db = require('./config/db');
const authRoute = require('./routes/auth.route');
const productRoute = require('./routes/product.route');
const cartRoute = require('./routes/cart.route');
const adminRoute = require('./routes/admin.route');
const exphbs = require('express-handlebars');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = mongoose.model('User'); // Make sure User model is available

// Register all models
require('./models/user.model');
require('./models/product.model');
require('./models/order.model');
require('./models/review.model');
require('./models/category.model');

db.connectDB(); // Connect to the database

dotenv.config();
const app = express();

// Configure Handlebars
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to parse JWT token from cookies or headers for views
const parseToken = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Fetch the full user object from the database
            const user = await User.findById(decoded._id).lean();
            if (user) {
                // Remove password from user object before attaching to request
                delete user.password;
                req.user = user;
            } else {
                req.user = null;
            }
        } catch (error) {
            // Token is invalid, but we don't want to block the request
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
};

app.use(parseToken);

// View Routes
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Trang chủ',
    user: req.user
  });
});

app.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('auth/login', {
    title: 'Đăng nhập',
    user: req.user
  });
});

app.get('/register', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('auth/reigster', {
    title: 'Đăng ký',
    user: req.user
  });
});

app.get('/products', (req, res) => {
  res.render('products/index', {
    title: 'Sản phẩm',
    user: req.user
  });
});

app.get('/products/:id', (req, res) => {
  res.render('products/detail', {
    title: 'Chi tiết sản phẩm',
    user: req.user,
    productId: req.params.id
  });
});

app.get('/cart', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('cart/index', {
    title: 'Giỏ hàng',
    user: req.user
  });
});

app.get('/profile', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('user/profile', {
    title: 'Thông tin cá nhân',
    user: req.user
  });
});

app.get('/orders', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('orders/index', {
    title: 'Đơn hàng của tôi',
    user: req.user
  });
});

app.get('/orders/:id', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('orders/detail', {
    title: 'Chi tiết đơn hàng',
    user: req.user,
    orderId: req.params.id
  });
});

app.get('/admin', (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.redirect('/');
  }
  res.render('admin/dashboard', {
    title: 'Quản trị',
    user: req.user
  });
});

// Admin View Routes (Protected)
app.get('/admin/products', (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.redirect('/');
  }
  res.render('admin/products', {
    title: 'Quản lý Sản phẩm',
    user: req.user
  });
});

app.get('/admin/users', (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.redirect('/');
  }
  res.render('admin/users', {
    title: 'Quản lý Người dùng',
    user: req.user
  });
});

app.get('/admin/orders', (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.redirect('/');
  }
  res.render('admin/orders', {
    title: 'Quản lý Đơn hàng',
    user: req.user
  });
});

app.get('/admin/reviews', (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.redirect('/');
  }
  res.render('admin/reviews', {
    title: 'Duyệt đánh giá',
    user: req.user
  });
});

// API Routes
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/api/v1/users', require('./routes/user.route'));
app.use('/api/v1/orders', require('./routes/order.route'));
app.use('/api/v1/reviews', require('./routes/review.route'));
app.use('/api/v1/categories', require('./routes/category.route'));

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});