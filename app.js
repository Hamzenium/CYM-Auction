const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const usersRouter = require('./routes/user/signUp');
const itemsRouter = require('./routes/item/ItemCatalogue');
const searchRouter = require('./routes/search/invertedSearch');
const biddingItem = require('./routes/bidding/biddingItem');
const paymentItem = require('./routes/payment/payment');
const app = express();
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware to parse JSON request body
app.use(bodyParser.json());

app.locals.admin = admin;

// Routes
app.use(cors());
app.use('/api', usersRouter);
app.use('/api', itemsRouter);
app.use('/api', searchRouter);
app.use('/api', biddingItem);
app.use('/api', paymentItem);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on http://localhost:3000 in mode", this.address().port, app.settings.env);
});

module.exports = app;
