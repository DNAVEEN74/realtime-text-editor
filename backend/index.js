const express = require('express');
const app = express();
const cors = require('cors');
const loginRoute = require('./routes/login');
const signUpRoute = require('./routes/signUp');
const refreshToken = require('./middlewares/refreshToken');
const connectDB = require('./db/dbConnect');

app.use(cors());
app.use(express.json());

connectDB();

app.use('/login', loginRoute);
app.use('/signUp', signUpRoute);
app.use('/refresh-token', refreshToken);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
