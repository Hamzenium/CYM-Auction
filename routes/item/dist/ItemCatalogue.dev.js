"use strict";

var express = require('express');

var router = express.Router();
router.post('/items', function _callee(req, res) {
  var _req$body, title, description, startingPrice, sellerId, images, category, condition, otherDetails, itemRef;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, description = _req$body.description, startingPrice = _req$body.startingPrice, sellerId = _req$body.sellerId, images = _req$body.images, category = _req$body.category, condition = _req$body.condition, otherDetails = _req$body.otherDetails;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('items').add({
            title: title,
            description: description,
            startingPrice: startingPrice,
            currentPrice: startingPrice,
            bidIncrement: 100,
            sellerId: sellerId,
            images: images,
            category: category,
            condition: condition,
            auctionStatus: 'open',
            startTime: req.app.locals.admin.firestore.FieldValue.serverTimestamp(),
            // Current timestamp
            endTime: null,
            winningBidderId: null,
            otherDetails: otherDetails
          }));

        case 4:
          itemRef = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(sellerId).update({
            items: req.app.locals.admin.firestore.FieldValue.arrayUnion(itemRef.id)
          }));

        case 7:
          res.status(201).json({
            message: 'Item created successfully',
            itemId: itemRef.id
          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          console.error('Error creating item:', _context.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
module.exports = router;