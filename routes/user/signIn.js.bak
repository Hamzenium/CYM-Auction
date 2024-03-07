import express from 'express';
const router = express.Router();

import {initializeApp} from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

//const authLib = require('@firebase/auth');

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

const auth = getAuth(app)

router.post('/', async (req, res) => {
	const { email, password } = req.body;
	//res.status(400).json({ error: 'Not Yet Implimented' });
		
    try{
		signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) =>{
			var user = userCredential.user;
			res.status(200).json({message: 'User signed in successfully', userId: user.uid});
		})
		.catch((error) => {
			res.status(401).json({ error: 'Invalid Login' });
			return;
		});
		/*
		if (!userRecord){
			res.status(401).json({ error: 'Invalid email' });
			return;
			console.log('here');
		}
		
		else if (userRecord.password != password ){
			res.status(401).json({ error: 'Invalid Password' });
			return;
		}
		else{
			
			res.status(201).json({ message: 'User signed in successfully', userId: userRecord.uid });
			/*
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
				} 
				catch (error) {
					  console.error('Error retrieving user dashboard:', error);
					  res.status(500).json({ error: 'Internal server error' });
				}
				
			}
			*/
		}
    catch(error){
        console.error('Error signing in user:', error);
		res.status(500).json({ error: 'Internal server error' });
    }
  });
 
//changed modules.exports = router to the following line  
  
export default router