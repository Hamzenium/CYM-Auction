"use strict";

var express = require('express');

var bodyParser = require('body-parser');

var cors = require('cors');

var admin = require('firebase-admin');

var usersRouter = require('./routes/user/signUp');

var itemsRouter = require('./routes/item/ItemCatalogue');

var searchRouter = require('./routes/search/invertedSearch');

var biddingItem = require('./routes/bidding/biddingItem');

var paymentItem = require('./routes/payment/payment');

var app = express();

var serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
}); // Middleware to parse JSON request body

app.use(bodyParser.json());
app.locals.admin = admin; // Routes

app.use(cors());
app.use('/api', usersRouter);
app.use('/api', itemsRouter);
app.use('/api', searchRouter);
app.use('/api', biddingItem);
app.use('/api', paymentItem);
app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on http://localhost:3000 in mode", this.address().port, app.settings.env);
});
module.exports = app;