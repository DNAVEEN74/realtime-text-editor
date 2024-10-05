const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  const secretKey = process.env.SECRET_KEY

  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if(decoded){
      req.userId = decoded.id
      console.log(decoded.id)
      next();
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = verifyToken;
