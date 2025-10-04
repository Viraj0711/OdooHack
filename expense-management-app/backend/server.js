const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

require('dotenv').config();

// Import configurations and middleware
const { sequelize } = require('./config/database');
const logger = require('./config/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { socketAuth } = require('./middleware/authMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const companyRoutes = require('./routes/companyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Make io accessible to routes
app.set('io', io);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(limiter);
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Expense Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/analytics', analyticsRoutes);

// Socket.io authentication middleware
io.use(socketAuth);

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.user.id}`);
  
  // Join user to their company room
  socket.join(`company_${socket.user.companyId}`);
  
  // Join user to their role-specific room
  socket.join(`role_${socket.user.role}`);
  
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.user.id}`);
  });
  
  // Handle expense submission notifications
  socket.on('expense_submitted', (data) => {
    // Notify managers and admins
    socket.to(`role_manager`).emit('new_expense', data);
    socket.to(`role_admin`).emit('new_expense', data);
  });
  
  // Handle approval notifications
  socket.on('expense_approved', (data) => {
    // Notify the expense submitter
    socket.to(`user_${data.userId}`).emit('expense_status_update', data);
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Sync database models (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('Database models synchronized successfully.');
    }
    
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server is running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`Health check available at: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  server.close(() => {
    logger.info('HTTP server closed.');
    sequelize.close();
    process.exit(0);
  });
});

module.exports = app;
