const express = require('express');
const router = express.Router();

router.get('/first', (req, res) => {
    res.send('Hello we are a Team');
});

router.get('/second', (req, res) => {
    res.send('Hello this is york assignemnt');
});
module.exports = router;
