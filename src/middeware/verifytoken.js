const jwt = require('jsonwebtoken');
require('dotenv').config();

const key = process.env.SECRET_KEY

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Unauthorized: Invalid token' });
      }
  
      req.user = user;
      next();
    });
  };

  module.exports = verifyToken;