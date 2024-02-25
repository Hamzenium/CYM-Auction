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

module.exports = updateSearchIndex;
