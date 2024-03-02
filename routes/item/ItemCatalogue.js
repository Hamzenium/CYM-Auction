const express = require('express');
const router = express.Router();

router.post('/items/:userId', async (req, res) => {
    const userID = req.params.userId;
    const { title, description, startingPrice, images, category, condition, otherDetails } = req.body;
  
    try {
        const itemRef = await req.app.locals.admin.firestore().collection('items').add({
            title: title,
            description: description,
            startingPrice: startingPrice,
            currentPrice: startingPrice, 
            bidIncrement: 100, 
            sellerId: userID, 
            images: images,
            category: category,
            condition: condition,
            auctionStatus: 'open', 
            startTime: req.app.locals.admin.firestore.FieldValue.serverTimestamp(), 
            endTime: null, 
            winningBidderId: null,
            currentBidder: null,  
            otherDetails: otherDetails
        });

        await updateSearchIndex(itemRef.id, title, description, req.app.locals.admin)

        // Construct the JSON object
        const itemObject = {
            itemRef: itemRef.id,
            title: title,
            description: description
        };
        await req.app.locals.admin.firestore().collection('users').doc(userID).update({
            items: req.app.locals.admin.firestore.FieldValue.arrayUnion(itemObject)
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
  
  async function updateSearchIndex(itemId, title, description, admin) {
    const stopWords = [
        'a', 'an', 'the', 'and', 'or', 'but', 'to', 'of', 'for', 'in', 'on',
        'with', 'by', 'at', 'from', 'about', 'into', 'during', 'before', 'after',
        'above', 'below', 'between', 'under', 'among', 'through', 'within', 'without',
        'behind', 'beyond', 'beside', 'above', 'below', 'amongst', 'underneath', 'whereas',
        'here', 'there', 'when', 'how', 'what', 'who', 'which', 'why', 'whom', 'whose'
    ];
    const combinedText = (title + ' ' + description).toLowerCase();

    const words = combinedText.split(" ").filter(word => !stopWords.includes(word));

    try {
        for (const word of words) {
            // Convert word to lowercase
            const lowercaseWord = word.toLowerCase();

            const wordDoc = await admin.firestore().collection('search').doc(lowercaseWord).get();

            if (wordDoc.exists) {
                await admin.firestore().collection('search').doc(lowercaseWord).update({
                    itemIds: admin.firestore.FieldValue.arrayUnion(itemId)
                });
            } else {
                await admin.firestore().collection('search').doc(lowercaseWord).set({
                    itemIds: [itemId]
                });
            }
        }
        console.log('Search index updated successfully');
    } catch (error) {
        console.error('Error updating search index:', error);
        throw error;
    }
}
  
module.exports = router;