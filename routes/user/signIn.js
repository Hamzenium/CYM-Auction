const express = require('express');
const router = express.Router();

 // intialize the DB of the user
router.post('/users', async (req, res) => {
    const { email, password, name } = req.body;
  
    try {
      const userRecord = await req.app.locals.admin.auth().createUser({
       
      });
  
     
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


 

module.exports = router;
