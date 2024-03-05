
const express = require('express');
//import express from 'express';
const router = express.Router();
//const auth = require('@firebase/auth');

 // intialize the DB of the user
router.post('/', async (req, res) => {
    const { email, password, firstName, lastName, streetNumber, streetAddress, postal } = req.body;
  
    try {
      const userRecord = await req.app.locals.admin.auth().createUser({
        email: email,
        password: password,
        firstName: firstName,
		lastName: lastName,
		steetNumber: streetNumber,
        steetAddress:  streetAddress,
		postal: postal
      });
  
      await req.app.locals.admin.firestore().collection('users').doc(userRecord.uid).set({
        email: email,
        firstName: firstName,
		lastName: lastName,
		steetNumber: streetNumber,
        steetAddress:  streetAddress,
		postal, postal,
        items: [],
        itemsWon: [],
        itemsBought:[],
        auctionEntered:[],

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


  
module.exports = router