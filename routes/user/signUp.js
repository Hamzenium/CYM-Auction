const express = require('express');
const router = express.Router();

 // intialize the DB of the user
router.post('/users/signup', async (req, res) => {
    const { email, password, name } = req.body;
  
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
  
      await req.app.locals.admin.firestore().collection('users').doc(userRecord.uid).set({
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
