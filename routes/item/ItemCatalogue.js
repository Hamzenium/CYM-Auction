const express = require('express');
const router = express.Router();

router.post('/items', async (req, res) => {
    const { title, description, startingPrice, sellerId, images, category, condition, otherDetails } = req.body;
  
    try {
      const itemRef = await req.app.locals.admin.firestore().collection('items').add({
        title: title,
        description: description,
        startingPrice: startingPrice,
        currentPrice: startingPrice, 
        bidIncrement: 100, 
        sellerId: sellerId,
        images: images,
        category: category,
        condition: condition,
        auctionStatus: 'open', 
        startTime: req.app.locals.admin.firestore.FieldValue.serverTimestamp(), // Current timestamp
        endTime: null, 
        winningBidderId: null, 
        otherDetails: otherDetails
      });
  
      await req.app.locals.admin.firestore().collection('users').doc(sellerId).update({
        items: req.app.locals.admin.firestore.FieldValue.arrayUnion(itemRef.id)
      });
  
      res.status(201).json({ message: 'Item created successfully', itemId: itemRef.id });
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;