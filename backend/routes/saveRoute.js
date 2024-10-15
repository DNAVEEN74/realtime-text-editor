const express = require('express');
const router = express.Router();
const Document = require('../db/documentSchema');

router.put('/:action', async (req, res) => {
    const { action } = req.params;
    const docID = req.body.docId;

    const document = await Document.findById(docID);

    if (!document) {
        return res.status(404).json({ error: "Document not found" });
    }

    if (action === 'saveDoc'){
        const newContent = req.body.newContent;

        document.docContent = newContent;
        await document.save();

        res.status(200).json({
            message: 'Saved content'
        });
    }else if(action === 'getContent'){
        const content = document.docContent;
        res.status(200).json({docContent: content})
    }
});

module.exports = router;