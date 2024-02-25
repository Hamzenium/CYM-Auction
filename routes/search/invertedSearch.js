const express = require('express');
const router = express.Router();

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
                itemsData.push(itemData);
            }
        }

        res.status(200).json({ items: itemsData });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  

module.exports = updateSearchIndex;
module.exports = router;