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

//   retrieve the item's dashboard containing all the details of the auction item
  router.get('/items/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    try {
      const itemDoc = await req.app.locals.admin.firestore().collection('items').doc(itemId).get();
  
      if (!itemDoc.exists) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      const itemData = itemDoc.data();
      res.status(200).json({ item: itemData });
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  //  edit the item's dashboard containing all the details of the auction item
  router.put('/items/:itemId', async (req, res) => {
    const itemId = req.params.itemId;
    const newData = req.body;
  
    try {
      await req.app.locals.admin.firestore().collection('items').doc(itemId).update(newData);
      res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
module.exports = router;