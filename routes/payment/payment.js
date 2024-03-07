import express from 'express';
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


router.get('/payment/items/delivered', async (req, res) => {
    const { user_id } = req.body;

    try {
        if (!user_id) {
            return res.status(400).json({ error: "User id is required" });
        }
        const userDoc = await req.app.locals.admin.firestore().collection('users').doc(user_id).get();
        const userData = userDoc.data();
        
        if (!userData || !userData.itemsDelivered) {
            return res.status(404).json({ error: "User or itemsBought not found" });
        }

        const result = userData.itemsDelivered;
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});
router.post("/payment/pay/item", async (req, res) => {
    const { buyerID, item_id, card_number, pin } = req.body;
    try {
        let isValid = false;
        if (card_number && pin) {
            isValid = true;
        }
        if (isValid) {
            const userDoc = await req.app.locals.admin.firestore().collection('users').doc(buyerID).get();
            const userData1 = userDoc.data();
            const userData = userData1.itemsBought;
            for (let i = 0; i < userData.length; i++) {
                if (userData[i] === item_id) {
                    await req.app.locals.admin.firestore().collection('users').doc(buyerID).update({
                        itemsBought: userData.filter(itemId => itemId !== item_id),
                        itemsDelivered: req.app.locals.admin.firestore.FieldValue.arrayUnion(item_id)
                    });
                    return res.status(200).send("Your payment was successful");
                }
            }
            return res.status(500).json("Item not found in user's bought items");
        } else {
            return res.status(500).json("Your payment was not successful");
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        return res.status(500).json("Internal Server Error");
    }
});





//changed modules.exports = router to the following line  

export default router