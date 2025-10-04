const jwt = require('jsonwebtoken');
const { User, Company } = require('../models');
const logger = require('../config/logger');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// Verify JWT token middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'currency', 'settings'],
        },
      ],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

// Socket.io authentication middleware
const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user || !user.isActive) {
      return next(new Error('Authentication error: Invalid or inactive user'));
    }

    socket.user = user;
    next();
  } catch (error) {
    logger.error('Socket authentication error:', error);
    next(new Error('Authentication error'));
  }
};

// Check if user owns resource or has admin/manager role
const authorizeResourceOwner = (resourceUserIdField = 'submittedById') => {
  return (req, res, next) => {
    const { user } = req;
    const resourceUserId = req.body[resourceUserIdField] || req.params.userId || req.resource?.[resourceUserIdField];

    // Admin and managers can access any resource
    if (user.role === 'admin' || user.role === 'manager') {
      return next();
    }

    // Users can only access their own resources
    if (user.id === resourceUserId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: Insufficient permissions',
    });
  };
};

// Company-based authorization (ensure user belongs to same company)
const authorizeCompany = (req, res, next) => {
  const { user } = req;
  const resourceCompanyId = req.body.companyId || req.params.companyId || req.resource?.companyId;

  if (user.companyId !== resourceCompanyId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Resource belongs to different company',
    });
  }

  next();
};

module.exports = {
  generateToken,
  authenticate,
  authorize,
  socketAuth,
  authorizeResourceOwner,
  authorizeCompany,
};