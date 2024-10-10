const express = require('express');
const router = express.Router();
const Document = require('../db/documentSchema');
const {v4: uuidv4} = require('uuid');

router.post('/', async (req, res) => {
    const type = req.query.type;

    if(type === 'CreateSession'){
        const docId = req.body.docId;
        const sessionId =uuidv4();
        
        const document = await Document.findById(docId);
            
        
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        
        document.sessionId = sessionId;
        await document.save();
        
        res.json({sessionId: sessionId});
    }else if (type === 'verifySessionId'){
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
    }else if(type === 'checkSessionIdExpiry'){
        const docId = req.body.docId;

        const document = await Document.findById(docId);

        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        
        if(document.sessionId){
            return res.status(200).json({shouldStop: false});
        }else {
            return res.status(200).json({shouldStop: true});
        }
    }
})

module.exports = router