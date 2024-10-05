const express = require('express');
const router = express.Router();
const jwtCheck = require('../middlewares/jwtMiddleware');
const Document = require('../db/documentSchema');

router.post('/', jwtCheck, async (req, res) => {
    const docTitle = req.body.title;
    const userId = req.userId;

    try {
        const docExists = await Document.findOne({  userId: req.userId, docTitle });
        if (docExists) {
            return res.status(400).json({ message: 'Given document title already exists' });
        }

        const newDoc = new Document({
            docTitle: docTitle,
            userId: userId
        });
        const docId = newDoc._id;
        await newDoc.save();

        res.status(201).json({ 
            message: 'New document created',
            docId: docId
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
