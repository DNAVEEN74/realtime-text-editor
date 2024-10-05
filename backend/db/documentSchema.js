const mongoose = require('mongoose');

const documentSchemaForDb = new mongoose.Schema({
    docTitle: String,
    sessionId: {
        type: String,
        default:""
    },
    lastModified: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: String,
        default:""
    },
    docContent: {
        type:String,
        default:""
    }
});

const Document = mongoose.model('Document', documentSchemaForDb);

module.exports = Document