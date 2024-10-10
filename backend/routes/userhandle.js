const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../db/userSchema');
require('dotenv').config();

const createToken = (userId) => {
    const secretKey = process.env.SECRET_KEY;
    return jwt.sign({ id: userId }, secretKey, { expiresIn: '7d' });
};

router.post('/:action', async (req, res) => {
    const { action } = req.params;
    const { fullName, email, password } = req.body;

    try {
        if (action === 'signup') {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User with this email already exists" });
            }

            const newUser = new User({ fullName, email, password });
            await newUser.save();

            const token = createToken(newUser._id);

            return res.status(201).json({ 
                message: 'User created successfully', 
                token,
                userId: newUser._id 
            });
        } else if (action === 'login') {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const isPasswordCorrect = await user.comparePassword(password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }

            const token = createToken(user._id);

            return res.status(200).json({ 
                message: 'Login successful', 
                token,
                userId: user._id 
            });
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error(`${action} error:`, error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;