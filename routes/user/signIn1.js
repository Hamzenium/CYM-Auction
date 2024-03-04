const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
	const {email, password} = req.body;
	res.status(400).json({ error: 'Not Yet Implimented' });
    try{
		const userRecord = await req.app.locals.admin.auth().getUserByEmail(req.params.email)
		if (!userRecord.exists) {
			res.status(401).json({ error: 'Invalid Login' });
			return;
		}
		else if (userRecord.password != req.params.password ){
			res.status(401).json({ error: 'Invalid Login' });
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
	}
    catch(error){
        console.error('Error signing in user:', error);
			res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
 module.exports = router;