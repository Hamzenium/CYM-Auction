"use strict";

var express = require('express');

var router = express.Router();
router.get('/', function (req, res) {
  res.send('Hello we are a Team');
});
module.exports = router;