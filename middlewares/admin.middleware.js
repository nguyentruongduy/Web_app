// Tệp: Web_app/middlewares/admin.middleware.js

module.exports = (req, res, next) => {
    // Sửa 'req.user.isAdmin' thành 'req.user.role !== 'admin''
    if (req.user.role !== 'admin') { 
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};