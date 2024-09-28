const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
  const oldToken = req.body.token;
  const secretKey = process.env.SECRET_KEY;

  try {
    const decoded = jwt.verify(oldToken, secretKey);
    const newToken = jwt.sign({ id: decoded.id }, secretKey, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }

});

module.exports = router;
