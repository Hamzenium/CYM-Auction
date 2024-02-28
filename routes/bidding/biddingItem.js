const express = require('express');
const router = express.Router();



router.post('/enter/auction', async (req, res) => {
    const { item_id, user_id } = req.body;

    try {
        // Update the user document to add the item to the list of auctions entered
        const userDocRef = req.app.locals.admin.firestore().collection('users').doc(user_id);
        await userDocRef.update({
            auctionEntered: req.app.locals.admin.firestore.FieldValue.arrayUnion(item_id)
        });

        res.status(200).json({ message: 'Auction entered successfully' });
    } catch (error) {
        console.error('Error entering auction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/add/bid', async (req, res) => {
    const { item_id, user_id } = req.body;

    if (!item_id || !user_id) {
        return res.status(400).json({ error: 'Missing item_id or user_id in request body' });
    }

    try {
        const itemRef = req.app.locals.admin.firestore().collection('items').doc(item_id);
        const itemDoc = await itemRef.get();

        if (!itemDoc.exists) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const itemData = itemDoc.data();
        const current_price = Number(itemData.currentPrice);
        const increment = Number(itemData.bidIncrement);

        // Calculate total price
        const total = current_price + increment;
        const price = total.toString(); 

        await itemRef.update({
            currentPrice: price,
            currentBidder: user_id
        });

        res.status(200).json({ message: 'Bid added successfully' });
    } catch (error) {
        console.error('Error adding bid:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/dashboard/bid/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userDoc = await req.app.locals.admin.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userData = userDoc.data().auctionEntered;
        const result = [];
        for (let i = 0; i < Math.min(userData.length); i++) {
            const itemId = userData[i];
            const itemDoc = await req.app.locals.admin.firestore().collection('items').doc(itemId).get();
            result.push(itemDoc.data());
        }
        res.status(200).json({ result });
    } catch (error) {
        console.error('Error retrieving user dashboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;