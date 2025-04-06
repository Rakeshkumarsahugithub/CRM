const jwt = require('jsonwebtoken');

module.exports = (role) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
      
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};