const jwt = require('../utils/jwt');

// Exclude these routes from authentication
const excludedUrls = ['/api/users/register', '/api/users/login','/api/plans/plans'];

const authenticate = (req, res, next) => {
  if (excludedUrls.includes(req.originalUrl)) {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1]; // Get token after 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verifyToken(token);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
