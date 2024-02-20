const express = require('express');
const router = express.Router();

router.post('/users', async (req, res) => {
    const { email, password, name } = req.body;
  
    try {
      const userRecord = await req.app.locals.admin.auth().createUser({
        email: email,
        password: password,
        displayName: name 
      });
  
      await req.app.locals.admin.firestore().collection('users').doc(userRecord.uid).set({
        email: email,
        name: name
      });
  
      res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;
