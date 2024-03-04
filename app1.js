import { initializeApp } from "firebase/app";

import {} from 'express';
import {}  from 'body-parser';
import {} from 'cors';
import {} from 'firebase-admin';
//import * as path from './routes/user/signUp.js';
//import * as path from './routes/user/signIn';
const itemsRouter = require('./routes/item/ItemCatalogue');
const searchRouter = require('./routes/search/invertedSearch');
const  biddingItem = require('./routes/bidding/biddingItem');

const app = express();
const serviceAccount = require('./key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware to parse JSON request body
app.use(bodyParser.json());

app.locals.admin = admin;

// Routes
//app.use(cors());
app.use('/signup', usersRouter);
app.use('/signin', userRouterSignIn);
app.use('/api', itemsRouter);
app.use('/api', searchRouter);
app.use('/api', biddingItem);


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on http://localhost:3000 in mode", this.address().port, app.settings.env);
});

module.exports = app;
