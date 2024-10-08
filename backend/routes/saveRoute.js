const express = require('express');
const router = express.Router();
const Document = require('../db/documentSchema');

router.put('/', async (req, res) => {
    const docID = req.body.docId;
    const newContent = req.body.newContent;

    const document = await Document.findById(docID);

    if (!document) {
        return res.status(404).json({ error: "Document not found" });
    }

    document.docContent = newContent;
    await document.save();

    res.status(200).json({
        message: 'Saved content'
    })
});

module.exports = router;