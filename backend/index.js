const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const loginRoute = require('./routes/login');
const signUpRoute = require('./routes/signUp');
const verifyToken = require('./middlewares/verifyToken');
const connectDB = require('./db/dbConnect');
const setUpWebSocketServer = require('./routes/webSocketServer');

app.use(cors());
app.use(express.json());

connectDB();

app.use('/login', loginRoute);
app.use('/signUp', signUpRoute);
app.use('/verify-token', verifyToken);

const server = http.createServer(app);

setUpWebSocketServer(server)

server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
