const express = require('express');
const router = express.Router();


router.get('/payment/items/bought', async (req, res) => {
    const { user_id } = req.body;

    try {
        if (!user_id) {
            return res.status(400).json({ error: "User id is required" });
        }
        const userDoc = await req.app.locals.admin.firestore().collection('users').doc(user_id).get();
        const userData = userDoc.data();
        
        if (!userData || !userData.itemsBought) {
            return res.status(404).json({ error: "User or itemsBought not found" });
        }

        const result = userData.itemsBought;
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});



module.exports = router;