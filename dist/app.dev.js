"use strict";

var express = require('express');

var cors = require('cors');

var homeRoute = require('./routes/home');

var app = express(); // Middleware

app.use(cors()); // Routes

app.use('/home', homeRoute);
module.exports = app;