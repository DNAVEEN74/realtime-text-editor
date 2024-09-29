const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/', (req, res) => {
  const oldToken = req.body.token;
  const secretKey = process.env.SECRET_KEY;

  if (!oldToken) {
    return res.status(401).json({ message: 'token is missing' });
  }

  try {
    const decoded = jwt.verify(oldToken, secretKey);
    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = decoded.exp - currentTime;

    if (remainingTime <= 600) {
      const newToken = jwt.sign({ id: decoded.id }, secretKey, { expiresIn: '7d' });
      return res.json({ token: newToken });
    } 
    
    res.json({ message: "token is verified" });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token is expired' });
    }
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
