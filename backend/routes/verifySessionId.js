const express = require('express');
const router = express.Router();
const Document = require('../db/documentSchema');

router.post('/', async (req, res) => {
    try {
        const documentSessionID = req.body.sessionId.trim();

        if (!documentSessionID) {
            return res.status(400).json({ message: 'Invalid sessionId or document not found' });
        }

        const document = await Document.findOne({ sessionId: documentSessionID });

        if (!document) {
            return res.status(404).json({
                message: 'Invalid sessionId or document not found',
            });
        }

        return res.status(200).json({
            message: 'sessionId verified',
            docId: document._id,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router