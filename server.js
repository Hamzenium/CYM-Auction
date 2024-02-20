const express = require('express');
const admin = require("firebase-admin");
const cors = require("cors");
const credentials = require("./key.json");


admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
  const db = admin.firestore();
  
  const app = express();
  app.use(cors());



app.get("/home", (req, res) => {
	res.send("Hello we are a Team")
})
app.listen(process.env.PORT || 3100, () => {
	console.log('http://localhost:3100/')
})