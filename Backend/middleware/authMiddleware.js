const jwt = require('jsonwebtoken');
const { Users } = require('../models/UserModel');

// Middleware to authenticate JWT tokens
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header first
    let token = null;
    
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        console.log('Authorization header does not start with Bearer');
        return res.status(401).json({
          success: false,
          message: 'Invalid authorization header format'
        });
      }
    }
    
    // If no token in Authorization header, try cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Verify token
    try {
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined');
        return res.status(500).json({
          success: false,
          message: 'Server configuration error'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user
      const user = await Users.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('User not found with ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Attach user to request
      req.user = user;
      next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      if (verifyError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          error: verifyError.message
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: verifyError.message
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
