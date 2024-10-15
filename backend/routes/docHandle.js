const express = require('express');
const router = express.Router();
const jwtCheck = require('../middlewares/jwtMiddleware');
const Document = require('../db/documentSchema');

router.post('/:action', jwtCheck, async (req, res) => {
    const { action } = req.params

        try {
            if(action === 'createDoc'){
                const { docTitle, userId } = req.body;
                const docExists = await Document.findOne({  userId: userId, docTitle });

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
            }else if(action === 'deleteDoc'){
                const { docTitle, userId } = req.body;
                const document = await Document.findOneAndDelete({userId: userId, docTitle});

                if (!document) {
                    return res.status(404).json({ message: 'Document not found' });
                }

                return res.status(200).json({ message: 'Document deleted successfully' });
            }else if(action === 'getContent'){
                const { docId } = req.body;

                const document = await Document.findById(docId);

                if (!document) {
                    return res.status(404).json({ message: 'Document not found' });
                }

                const content = document.docContent;
                res.status(200).json({docContent: content})
            }
        }catch (error) {
                return res.status(500).json({ message: 'Server error' });
        }

});

module.exports = router;
