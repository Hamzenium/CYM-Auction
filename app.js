const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const usersRouter = require('./routes/signUp');

const app = express();
const PORT = process.env.PORT || 3100;

const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware to parse JSON request body
app.use(bodyParser.json());

app.locals.admin = admin;

// Routes
app.use('/api', usersRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
