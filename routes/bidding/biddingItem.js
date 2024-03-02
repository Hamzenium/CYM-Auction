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

router.get('/auction/time/left', async (req, res) => {
    const { item_id } = req.body;
    if (!item_id) {
        throw new Error("Item id not sent");
    }
    try {
        const itemRef = req.app.locals.admin.firestore().collection('items').doc(item_id);
        const itemDoc = await itemRef.get();
        const itemData = itemDoc.data();
        const currentTime = new Date().getTime();
        const endTime = itemData.endTime.toDate().getTime();

        const timeDifference = endTime - currentTime;
        let timeLeft;
        if (timeDifference <= 0) {
            timeLeft = "Auction has ended";
        } else {
            const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

            if (daysLeft > 0) {
                timeLeft = `${daysLeft} days ${hoursLeft} hours ${minutesLeft} minutes`;
            } else if (hoursLeft > 0) {
                timeLeft = `${hoursLeft} hours ${minutesLeft} minutes`;
            } else {
                timeLeft = `${minutesLeft} minutes`;
            }
        }

        res.status(200).json({ timeLeft });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/add/bid', async (req, res) => {
    const { item_id, user_id } = req.body;

    if (!item_id || !user_id) {
        return res.status(400).json({ error: 'Missing item_id or user_id in request body' });
    }

    try {
        const itemRef = req.app.locals.admin.firestore().collection('items').doc(item_id);
        const itemDoc = await itemRef.get().catch(error => { throw error; });

        if (!itemDoc.exists) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const itemData = itemDoc.data();

        const currentTime = new Date().getTime();
        const endTime = itemData.endTime.toDate().getTime();

        if (itemData.auctionStatus.toLowerCase() === "close") {
            const itemDoc = await itemRef.get();
            const itemData = itemDoc.data();
            const uid = itemData.winningBidderId
            const winnerName = await winner(uid,item_id,req,res)
            res.status(200).json("The Auction has ended and the winner is: "+winnerName)
        }

        if (currentTime >= endTime) {
            await setStatus(item_id, req, res).catch(error => { throw error; });
            const itemDoc = await itemRef.get();
            const itemData = itemDoc.data();
            const uid = itemData.winningBidderId
            const winnerName = await winner(uid,item_id)
            res.status(200).json("The Auction has ended and the winner is: "+winnerName)
        }

        const current_price = Number(itemData.currentPrice);
        const increment = Number(itemData.bidIncrement);

        const total = current_price + increment;
        const price = total.toString();

        await itemRef.update({
            currentPrice: price,
            currentBidder: user_id
        }).catch(error => { throw error; });

        return res.status(200).json({ message: 'Bid added successfully' });
    } catch (error) {
        console.error('Error adding bid:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

async function setStatus(item_id, req) {
    try {
        const itemRef = req.app.locals.admin.firestore().collection('items').doc(item_id);
        const itemDoc = await itemRef.get().catch(error => { throw error; });

        if (!itemDoc.exists) {
            return { error: 'Item not found' };
        }

        const winner = itemDoc.data().currentBidder;

        await itemRef.update({
            winningBidderId: winner,
            auctionStatus: "close"
        }).catch(error => { throw error; });

        return "The Auction has ended";
    } catch (error) {
        console.error('Error setting status:', error);
        return "There were some errors.";
    }
}

async function winner(uid,item_id,req,res){

    try{
        const userRef = req.app.locals.admin.firestore().collection('users').doc(uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const winnerName =  userData.name
        await req.app.locals.admin.firestore().collection('users').doc(uid).update({
            itemsBought: req.app.locals.admin.firestore.FieldValue.arrayUnion(item_id)
        });
        return winnerName
    }
    catch(error){
       res.status(500).json("There were some unexpected erros")
    }

}

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