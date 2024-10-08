const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const loginRoute = require('./routes/login');
const signUpRoute = require('./routes/signUp');
const generateSession = require('./routes/sessionId');
const verifyToken = require('./middlewares/verifyToken');
const verifySessionId = require('./routes/verifySessionId');
const saveRoute = require('./routes/saveRoute');
const pdfDownload = require('./routes/pdfDownload');
const projectsHistory = require('./routes/projectsHistory');
const connectDB = require('./db/dbConnect');
const setUpWebSocketServer = require('./routes/webSocketServer');
const createDoc = require('./routes/createDoc');

const corsOptions = {
  origin: '*',
  exposedHeaders: ['Content-Disposition'],
};

app.use(cors(corsOptions));
app.use(express.json());

connectDB();

app.use('/login', loginRoute);
app.use('/signUp', signUpRoute);
app.use('/verify-token', verifyToken);
app.use('/generate-sessionId', generateSession);
app.use('/create-document', createDoc);
app.use('/verify-sessionId', verifySessionId);
app.use('/saveContent', saveRoute);
app.use('/download-pdf', pdfDownload);
app.use('/projectsHistory', projectsHistory);

const server = http.createServer(app);

setUpWebSocketServer(server)

server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
