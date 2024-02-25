"use strict";

var express = require('express');

var router = express.Router();

var search = require('../search/invertedSearch');

var addSearch = require('../search/invertedSearch');

router.post('/items/:userId', function _callee(req, res) {
  var userID, _req$body, title, description, startingPrice, images, category, condition, otherDetails, itemRef, _JSON;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userID = req.params.userId;
          _req$body = req.body, title = _req$body.title, description = _req$body.description, startingPrice = _req$body.startingPrice, images = _req$body.images, category = _req$body.category, condition = _req$body.condition, otherDetails = _req$body.otherDetails;
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('items').add({
            title: title,
            description: description,
            startingPrice: startingPrice,
            currentPrice: startingPrice,
            bidIncrement: 100,
            sellerId: userID,
            // Use userID here
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

        case 5:
          itemRef = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(addSearch(itemRef.id, title, description, req.app.locals.admin));

        case 8:
          _JSON = {
            "itemRef": itemRef.id,
            "title": title,
            "description": description
          };
          _context.next = 11;
          return regeneratorRuntime.awrap(admin.firestore().collection('users').doc(userID).update({
            items: req.app.locals.admin.firestore.FieldValue.arrayUnion(_JSON)
          }));

        case 11:
          res.status(201).json({
            message: 'Item created successfully',
            itemId: itemRef.id
          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](2);
          console.error('Error creating item:', _context.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 14]]);
}); //   retrieve the item's dashboard containing all the details of the auction item

router.get('/items/:itemId', function _callee2(req, res) {
  var itemId, itemDoc, itemData;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          itemId = req.params.itemId;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('items').doc(itemId).get());

        case 4:
          itemDoc = _context2.sent;

          if (itemDoc.exists) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'Item not found'
          }));

        case 7:
          itemData = itemDoc.data();
          res.status(200).json({
            item: itemData
          });
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](1);
          console.error('Error fetching item:', _context2.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); //  edit the item's dashboard containing all the details of the auction item

router.put('/items/:itemId', function _callee3(req, res) {
  var itemId, newData;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          itemId = req.params.itemId;
          newData = req.body;
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('items').doc(itemId).update(newData));

        case 5:
          res.status(200).json({
            message: 'Item updated successfully'
          });
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](2);
          console.error('Error updating item:', _context3.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 8]]);
});
module.exports = router;