"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var admin = require('firebase-admin');

var usersRouter = require('./routes/user/signUp');

var itemsRouter = require('./routes/item/ItemCatalogue');

var app = express();
var PORT = process.env.PORT || 3100;

var serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}); // Middleware to parse JSON request body werere

app.use(bodyParser.json());
app.locals.admin = admin; // Routes

app.use('/api', usersRouter);
app.use('/api', itemsRouter);
app.listen(PORT, function () {
  console.log("Server is running on http://localhost:".concat(PORT));
});
module.exports = app;