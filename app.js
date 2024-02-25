const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const usersRouter = require('./routes/user/signUp');
const itemsRouter = require('./routes/item/ItemCatalogue');
const searchRouter = require('./routes/search/invertedSearch');

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


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;
