const jwt = require('jsonwebtoken');
const { Register, Users } = require('../models/UserModel');

// Middleware to authenticate JWT tokens
const authMiddleware = async (req, res, next) => {
  try {
    // Check if cookies object exists
    if (!req.cookies) {
      console.log('No cookies object in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required - no cookies found'
      });
    }
    
    // Get token from cookies
    const token = req.cookies.jwt;
    
    if (!token) {
      console.log('No JWT token found in cookies');
      return res.status(401).json({
        success: false,
        message: 'Authentication required - no token found'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Try finding the user in either collection
    let user = null;
    
    // First try the Register collection
    user = await Register.findById(decoded.id).select('-password');
    
    // If not found in Register, try the Users collection
    if (!user) {
      console.log('User not found in Register collection, trying Users collection');
      user = await Users.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      console.log('User not found in either collection with ID:', decoded.id);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('Found user:', {
      id: user._id,
      username: user.username,
      role: user.role
    });

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, please log in again'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token, please log in again'
      });
    }
    
    // Generic error
    res.status(401).json({
      success: false,
      message: 'Invalid authentication'
    });
  }
};

module.exports = authMiddleware;
