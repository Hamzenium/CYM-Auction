import {initializeApp, getAuth, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {getDatabase, set, ref} 'https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js';
import {getAuth, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';


const express = require('express');
const router = express.Router();

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

const app = initializeApp(firebaseConfig);
//const db = getFirestore(app)
const auth = getAuth(app)

 // intialize the DB of the user
router.post('/users/signup', async (req, res) => {
    const { email, password, fname, lname, streetAddress, streetNumber, postal } = req.body;
	
	//create User using SDK
	createUserWithEmailAndPassword(auth, email, password)
	.then((userCredential) ==>{
		const user = userCredential.user;
	})
	.catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
	
	/*
	non sdk user creation
    try {
      const userRecord = await req.app.locals.admin.auth().createUser({
        email: email,
        password: password,
        fName: fName,
		lName: laname,
		streetAddress: streetAddress,
		streetNumber: streetNumber,
		postal: postal
      });
  */
      await req.app.locals.admin.firestore().collection('users').doc(user.uid).set({
        email: email,
        fName: fName,
		lName: lname,
		streetAddress: streetAddress,
		streetNumber: streetNumber,
		postal: postal,
        items: [],
        itemsBought: [],
        itemsDelivered:[],
        auctionEntered:[]

      });
  
      res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // to retrieve the dashboard of the user himself
  router.get('/dashboard/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const userDoc = await req.app.locals.admin.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      const userData = userDoc.data();
      res.status(200).json({ userData });
    } catch (error) {
      console.error('Error retrieving user dashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
