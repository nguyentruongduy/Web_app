const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // First, try to get the token from cookies
    let token = req.cookies.token;

    // If not in cookies, try to get it from the Authorization header
    if (!token && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        // console.log('req.user in auth.middleware:', req.user);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}