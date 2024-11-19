const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: No token provided'
        });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (res.headersSent) return;

        console.error('JWT error:', error.message);
        const message = error.name === 'TokenExpiredError'
            ? 'Session expired, please log in again'
            : 'Unauthorized: Invalid token';

        return res.status(401).json({
            success: false,
            error: message
        });
    }

    try {
        const user = await User.findById(decoded.id);
        if (!user) {
            console.log('Token invalid - user not found');
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: Invalid token'
            });
        }

        if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token"
            });
        }

        console.log('Authenticated user:', user);
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};

module.exports = authMiddleware;