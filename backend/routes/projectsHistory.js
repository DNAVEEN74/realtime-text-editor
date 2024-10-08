const express = require('express');
const router = express.Router();
const Document = require('../db/documentSchema');

router.get('/', async (req, res) => {
    try {
        const type = req.query.type;

        if(type === 'retrieveDocumentTitles'){
            const userId = req.query.userId;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const documents = await Document.find({ userId: userId });

            const titles = documents.map(doc => doc.docTitle);

            res.json(titles);
        }else if(type === 'retrieveDocumentId'){
            const userId = req.query.userId;

            if (!userId) {
                return res.status(401).json({ message: 'User not authenticated' });
              }

            const documentTitle = req.query.docTitle;

            if(!documentTitle){
                return res.status(400).json({ message: 'Document title is required' });
            }

            const documents = await Document.find({ userId: userId });

            const document = documents.find(doc => doc.docTitle === documentTitle);

            if (document) {
                return res.status(200).json({ documentId: document._id });
            } else {
                return res.status(404).json({ message: 'Document not found' });
            }

        }

    }catch (error){
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = router