const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../db/userSchema');
require('dotenv').config();

const createToken = (userId) => {
  const secretKey = process.env.SECRET_KEY
  return jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
};

router.post('/', async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const token = createToken(user._id);
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  module.exports = router;