"use strict";

var express = require('express');

var admin = require("firebase-admin");

var cors = require("cors");

var credentials = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials)
});
var db = admin.firestore();
var app = express();
app.use(cors());
app.get("/home", function (req, res) {
  res.send("Hello we are a Team");
});
app.listen(process.env.PORT || 3100, function () {
  console.log('http://localhost:3100/');
});