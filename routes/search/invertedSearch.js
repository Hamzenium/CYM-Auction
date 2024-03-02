const express = require('express');
const router = express.Router();



router.get('/search/:word', async (req, res) => {
    const word = req.params.word;
    try {
        // Retrieve item IDs associated with the search word
        const searchDoc = await req.app.locals.admin.firestore().collection('search').doc(word).get();

        if (!searchDoc.exists) {
            return res.status(404).json({ error: 'No items found for the search word' });
        }

        const searchItemData = searchDoc.data();
        const itemIds = searchItemData.itemIds || [];

        const itemsData = [];
        for (let i = 0; i < Math.min(itemIds.length, 10); i++) {
            const itemId = itemIds[i];
            const itemDoc = await req.app.locals.admin.firestore().collection('items').doc(itemId).get();

            if (itemDoc.exists) {
                const itemData = itemDoc.data();
                if (itemData.status == "open"){
                    itemsData.push(itemData);
                }
            }
        }

        res.status(200).json({ items: itemsData });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  

module.exports = router;