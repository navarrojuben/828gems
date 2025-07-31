const jwt = require('jsonwebtoken');

exports.protectAdmin = (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Allow both master and regular admins
      req.admin = decoded.id;
      req.isMaster = decoded.isMaster || false;
  
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
  
