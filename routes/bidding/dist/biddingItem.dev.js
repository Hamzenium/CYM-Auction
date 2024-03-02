"use strict";

var express = require('express');

var _require = require('pdf-lib'),
    pdfDocEncodingDecode = _require.pdfDocEncodingDecode,
    copyStringIntoBuffer = _require.copyStringIntoBuffer,
    error = _require.error;

var router = express.Router();
router.post('/enter/auction', function _callee(req, res) {
  var _req$body, item_id, user_id, userDocRef;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, item_id = _req$body.item_id, user_id = _req$body.user_id;
          _context.prev = 1;
          // Update the user document to add the item to the list of auctions entered
          userDocRef = req.app.locals.admin.firestore().collection('users').doc(user_id);
          _context.next = 5;
          return regeneratorRuntime.awrap(userDocRef.update({
            auctionEntered: req.app.locals.admin.firestore.FieldValue.arrayUnion(item_id)
          }));

        case 5:
          res.status(200).json({
            message: 'Auction entered successfully'
          });
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error('Error entering auction:', _context.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.get('/auction/time/left', function _callee2(req, res) {
  var item_id, itemRef, itemDoc, itemData, currentTime, endTime, timeDifference, timeLeft, daysLeft, hoursLeft, minutesLeft;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          item_id = req.body.item_id;

          if (item_id) {
            _context2.next = 3;
            break;
          }

          throw new Error("Item id not sent");

        case 3:
          _context2.prev = 3;
          itemRef = req.app.locals.admin.firestore().collection('items').doc(item_id);
          _context2.next = 7;
          return regeneratorRuntime.awrap(itemRef.get());

        case 7:
          itemDoc = _context2.sent;
          itemData = itemDoc.data();
          currentTime = new Date().getTime();
          endTime = itemData.endTime.toDate().getTime();
          timeDifference = endTime - currentTime;

          if (timeDifference <= 0) {
            timeLeft = "Auction has ended";
          } else {
            daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            hoursLeft = Math.floor(timeDifference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            minutesLeft = Math.floor(timeDifference % (1000 * 60 * 60) / (1000 * 60));

            if (daysLeft > 0) {
              timeLeft = "".concat(daysLeft, " days ").concat(hoursLeft, " hours ").concat(minutesLeft, " minutes");
            } else if (hoursLeft > 0) {
              timeLeft = "".concat(hoursLeft, " hours ").concat(minutesLeft, " minutes");
            } else {
              timeLeft = "".concat(minutesLeft, " minutes");
            }
          }

          res.status(200).json({
            timeLeft: timeLeft
          });
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](3);
          console.error("Error:", _context2.t0);
          res.status(500).json({
            error: "Internal Server Error"
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 16]]);
});
router.post('/add/bid', function _callee3(req, res) {
  var _req$body2, item_id, user_id, itemRef, itemDoc, itemData, currentTime, endTime, _itemDoc, _itemData, uid, winnerName, _itemDoc2, _itemData2, _uid, _winnerName, current_price, increment, total, price;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, item_id = _req$body2.item_id, user_id = _req$body2.user_id;

          if (!(!item_id || !user_id)) {
            _context3.next = 3;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Missing item_id or user_id in request body'
          }));

        case 3:
          _context3.prev = 3;
          itemRef = req.app.locals.admin.firestore().collection('items').doc(item_id);
          _context3.next = 7;
          return regeneratorRuntime.awrap(itemRef.get()["catch"](function (error) {
            throw error;
          }));

        case 7:
          itemDoc = _context3.sent;

          if (itemDoc.exists) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Item not found'
          }));

        case 10:
          itemData = itemDoc.data();
          currentTime = new Date().getTime();
          endTime = itemData.endTime.toDate().getTime();

          if (!(itemData.auctionStatus.toLowerCase() === "close")) {
            _context3.next = 23;
            break;
          }

          _context3.next = 16;
          return regeneratorRuntime.awrap(itemRef.get());

        case 16:
          _itemDoc = _context3.sent;
          _itemData = _itemDoc.data();
          uid = _itemData.winningBidderId;
          _context3.next = 21;
          return regeneratorRuntime.awrap(winner(uid, req, res));

        case 21:
          winnerName = _context3.sent;
          res.status(200).json("The Auction has ended and the winner is: " + winnerName);

        case 23:
          if (!(currentTime >= endTime)) {
            _context3.next = 35;
            break;
          }

          _context3.next = 26;
          return regeneratorRuntime.awrap(setStatus(item_id, req, res)["catch"](function (error) {
            throw error;
          }));

        case 26:
          _context3.next = 28;
          return regeneratorRuntime.awrap(itemRef.get());

        case 28:
          _itemDoc2 = _context3.sent;
          _itemData2 = _itemDoc2.data();
          _uid = _itemData2.winningBidderId;
          _context3.next = 33;
          return regeneratorRuntime.awrap(winner(_uid));

        case 33:
          _winnerName = _context3.sent;
          res.status(200).json("The Auction has ended and the winner is: " + _winnerName);

        case 35:
          current_price = Number(itemData.currentPrice);
          increment = Number(itemData.bidIncrement);
          total = current_price + increment;
          price = total.toString();
          _context3.next = 41;
          return regeneratorRuntime.awrap(itemRef.update({
            currentPrice: price,
            currentBidder: user_id
          })["catch"](function (error) {
            throw error;
          }));

        case 41:
          return _context3.abrupt("return", res.status(200).json({
            message: 'Bid added successfully'
          }));

        case 44:
          _context3.prev = 44;
          _context3.t0 = _context3["catch"](3);
          console.error('Error adding bid:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            error: 'Internal server error'
          }));

        case 48:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 44]]);
});

function setStatus(item_id, req, res) {
  var itemRef, itemDoc, _winner;

  return regeneratorRuntime.async(function setStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          itemRef = req.app.locals.admin.firestore().collection('items').doc(item_id);
          _context4.next = 4;
          return regeneratorRuntime.awrap(itemRef.get()["catch"](function (error) {
            throw error;
          }));

        case 4:
          itemDoc = _context4.sent;

          if (itemDoc.exists) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", {
            error: 'Item not found'
          });

        case 7:
          _winner = itemDoc.data().currentBidder;
          _context4.next = 10;
          return regeneratorRuntime.awrap(itemRef.update({
            winningBidderId: _winner,
            auctionStatus: "close"
          })["catch"](function (error) {
            throw error;
          }));

        case 10:
          return _context4.abrupt("return", "The Auction has ended");

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error('Error setting status:', _context4.t0);
          return _context4.abrupt("return", "There were some errors.");

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
}

function winner(uid, req, res) {
  var userRef, userDoc, userData, winnerName;
  return regeneratorRuntime.async(function winner$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userRef = req.app.locals.admin.firestore().collection('users').doc(uid);
          _context5.next = 4;
          return regeneratorRuntime.awrap(userRef.get());

        case 4:
          userDoc = _context5.sent;
          userData = userDoc.data();
          winnerName = userData.name;
          return _context5.abrupt("return", winnerName);

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json("There were some unexpected erros");

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

router.get('/dashboard/bid/:userId', function _callee4(req, res) {
  var userId, userDoc, userData, result, i, itemId, itemDoc;
  return regeneratorRuntime.async(function _callee4$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = req.params.userId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(userId).get());

        case 4:
          userDoc = _context6.sent;

          if (userDoc.exists) {
            _context6.next = 8;
            break;
          }

          res.status(404).json({
            error: 'User not found'
          });
          return _context6.abrupt("return");

        case 8:
          userData = userDoc.data().auctionEntered;
          result = [];
          i = 0;

        case 11:
          if (!(i < Math.min(userData.length))) {
            _context6.next = 20;
            break;
          }

          itemId = userData[i];
          _context6.next = 15;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('items').doc(itemId).get());

        case 15:
          itemDoc = _context6.sent;
          result.push(itemDoc.data());

        case 17:
          i++;
          _context6.next = 11;
          break;

        case 20:
          res.status(200).json({
            result: result
          });
          _context6.next = 27;
          break;

        case 23:
          _context6.prev = 23;
          _context6.t0 = _context6["catch"](0);
          console.error('Error retrieving user dashboard:', _context6.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 27:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 23]]);
});
module.exports = router;