const express = require('express');
const cors = require('cors');
const homeRoute = require('./routes/home');

const app = express();
const PORT = process.env.PORT || 3100; // Define the port to listen on, default is 3100

// Middleware
app.use(cors());

// Routes
app.use('/home', homeRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
