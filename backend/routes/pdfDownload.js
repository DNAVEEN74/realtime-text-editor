const express = require('express');
const router = express.Router();
const Document = require('../db/documentSchema');
const pdf = require('html-pdf');

router.post('/', async (req, res) => {
    const docID = req.body.docId;
    const content = req.body.content;

    const document = await Document.findById(docID);

    if (!document) {
        return res.status(404).json({ error: "Document not found" });
    }

    if(!(document.docContent === content)){
        return res.status(404).json({error: 'Document is not Saved or Something went wrong'});
    }

    const htmlTemplate = `
        <html>
            <head>
                <title>${document.docTitle}</title>
                <style>
                    body { background-color: white; }
                    .content { margin: 20px; }
                </style>
            </head>
            <body>
                <div class="content">${content}</div>
            </body>
        </html>
    `;

    pdf.create(htmlTemplate).toStream((err, stream) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to generate PDF' });
        }

        res.setHeader('Content-type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${document.docTitle}.pdf`);
        stream.pipe(res);
    });
});

module.exports = router;