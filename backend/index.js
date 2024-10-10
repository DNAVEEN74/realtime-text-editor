const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const authentication = require('./routes/userhandle');
const generateSession = require('./routes/sessionId');
const verifyToken = require('./middlewares/verifyToken');
const saveRoute = require('./routes/saveRoute');
const pdfDownload = require('./routes/pdfDownload');
const projectsHistory = require('./routes/projectsHistory');
const connectDB = require('./db/dbConnect');
const setUpWebSocketServer = require('./routes/webSocketServer');
const docHandle = require('./routes/docHandle');

const corsOptions = {
  origin: '*',
  exposedHeaders: ['Content-Disposition'],
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/auth', authentication);
app.use('/verify-token', verifyToken);
app.use('/generate-sessionId', generateSession);
app.use('/docHandle', docHandle);
app.use('/saveContent', saveRoute);
app.use('/download-pdf', pdfDownload);
app.use('/projectsHistory', projectsHistory);

const server = http.createServer(app);

setUpWebSocketServer(server)

server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
