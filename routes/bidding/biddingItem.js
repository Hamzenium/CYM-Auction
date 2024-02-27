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



module.exports = router;