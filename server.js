const express = require('express');
const app = express();

app.get("/home", (req, res) => {
	res.send("Hello we are a Team")
})
app.listen(process.env.PORT || 3100, () => {
	console.log('http://localhost:3100/')
})