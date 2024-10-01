const mongoose = require('mongoose');
const { z } = require('zod');

const DocumentSchema = z.object({
    title: z.string(),
    content: z.array(z.any()),
    lasModified: z.date(),
    userId: z.string()
});

const documentSchemaForDb = new mongoose.Schema({
    title: string,
    content: Array,
    lastModified: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const Document = mongoose.model('Document', documentSchemaForDb);

module.exports = Document