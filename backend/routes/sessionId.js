const express = require('express');
const router = express.Router();
const Document = require('../db/documentSchema');
const {v4: uuidv4} = require('uuid');

router.post('/', async (req, res) => {

            const docId = req.body.docId;
            const sessionId =uuidv4();
        
            const document = await Document.findById(docId);
            
        
            if (!document) {
                return res.status(404).json({ error: "Document not found" });
            }
        
            document.sessionId = sessionId;
            await document.save();
        
            res.json({sessionId: sessionId});
})

module.exports = router