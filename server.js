require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet'); // For securing HTTP headers
const rateLimit = require('express-rate-limit'); // Rate limiting
const logger = require('./src/config/logger'); 
const db = require('./src/config/db'); 

const authRoutes = require('./src/routes/authRoutes');
const scriptRoutes = require('./src/routes/scriptRoutes');
const userRoutes = require('./src/routes/userRoutes');
const planSubscriptionRoute = require('./src/routes/planSubscriptionRoute');

const validate = require('./src/middlewares/validate');
const { authenticate } = require('./src/middlewares/authMiddleware');
const app = express();

// Middleware setup
app.use(helmet());
app.use(cors()); 
app.use(bodyParser.json()); 

// Rate limiting to prevent brute-force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', apiLimiter);
// app.use('/api/',validate)       // centralised validation
app.use('/api/',authenticate) 

app.locals.db = db;

// Routes
app.use('/api/auth', authRoutes);    // Authentication routes
app.use('/api/scripts', scriptRoutes); // Script generation routes
app.use('/api/users', userRoutes);   // User routes
app.use('/api/plans', planSubscriptionRoute);   // plan/subscription routes

app.get('/', (req, res) => {
  res.send('Welcome to the YouTube Script Generation SaaS!');
});

app.use((err, req, res, next) => {
  logger.error(err.message); // Log the error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    logger.info('HTTP server closed');
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
