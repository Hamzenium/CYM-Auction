//import { initializeApp } from "firebase/app";

//changed const name require('file') 
//		-> 	import pkg from 'file'
//			const name = pkg
import expressPkg from 'express';
const express = expressPkg;
import pkg  from 'body-parser';
const bodyParser = pkg
import corsPkg from 'cors';
const cors = corsPkg;
import pack from 'firebase-admin';
const admin = pack

import pathPkg from 'path';
const path = pathPkg;

const __dirname = path.resolve(path.dirname('')); 
//const path = require('path')

import {default as signIn} from './routes/user/signIn.js';
import {default as signUp}  from './routes/user/signUp.js';
import {default as itemCatalogue}  from './routes/item/ItemCatalogue.js';
import {default as searchRouter} from './routes/search/invertedSearch.js';
import {default as  biddingItem} from './routes/bidding/biddingItem.js';
import {default as paymentItem} from './routes/payment/payment.js';

const app = express();

import serviceAccount from './key.json' with {type: 'json'};
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {

  apiKey: "AIzaSyASzODFRoEywWL42LyIFwxJbIxzQT2elRk",

  authDomain: "eecs4413-6983c.firebaseapp.com",

  databaseURL: "https://eecs4413-6983c-default-rtdb.firebaseio.com",

  projectId: "eecs4413-6983c",

  storageBucket: "eecs4413-6983c.appspot.com",

  messagingSenderId: "236603067661",

  appId: "1:236603067661:web:5e24337180d0eea066f444",

  measurementId: "G-1CL3HY7CNK"

};



// Middleware to parse JSON request body
app.use(bodyParser.json());

app.locals.admin = admin;

// Routes
app.use(cors());
app.use('/api', signUp);
app.use('/api', signIn);
app.use('/api', itemCatalogue);
app.use('/api', searchRouter);
app.use('/api', biddingItem);
app.use('/api', paymentItem);


app.get('/signin', function(req, res){
	res.sendFile(path.join(__dirname + '/webpages/signin.html'))
});

app.get('/signup', function(req, res){
	res.sendFile(path.join(__dirname + '/webpages/signup.html'))
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on http://localhost:3000 in mode", this.address().port, app.settings.env);
});


//changed modules.exports = app to the following line
export default app;
