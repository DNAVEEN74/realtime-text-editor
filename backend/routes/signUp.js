const express = require('express');
const router = express.Router();
const User = require('../db/userSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (userId) => {
    const secretKey = process.env.SECRET_KEY
    return jwt.sign({ id: userId }, secretKey, { expiresIn: '7d' });
  };

  router.post('/', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const newUser = new User({ fullName, email, password });
        await newUser.save();

        const token = createToken(newUser._id);

        res.status(201).json({ 
            message: 'User created successfully', 
            token,
            userId: newUser._id
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;