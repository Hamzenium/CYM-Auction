const express = require('express');
const router = express.Router();
import {initializeApp, getAuth, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js';
import {getDatabase, set, ref} 'https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js';
import {getAuth, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';


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


signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
	const userDoc = await req.app.locals.admin.firestore().collection('users').doc(user.uid).get();
    const userData = userDoc.data();
      res.status(200).json({ userData });
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

 // intialize the DB of the user

	// to retrieve the dashboard of the user himself
  

module.exports = router;
