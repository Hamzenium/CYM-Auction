"use strict";

var express = require('express');

var router = express.Router();
router.get('/search/:word', function _callee(req, res) {
  var word, searchDoc, searchItemData, itemIds, itemsData, i, itemId, itemDoc, itemData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          word = req.params.word;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('search').doc(word).get());

        case 4:
          searchDoc = _context.sent;

          if (searchDoc.exists) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            items: []
          }));

        case 7:
          searchItemData = searchDoc.data();
          itemIds = searchItemData.itemIds || [];
          itemsData = [];
          i = 0;

        case 11:
          if (!(i < itemIds.length)) {
            _context.next = 20;
            break;
          }

          itemId = itemIds[i];
          _context.next = 15;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('items').doc(itemId).get());

        case 15:
          itemDoc = _context.sent;

          if (itemDoc.exists) {
            itemData = itemDoc.data();

            if (itemData.auctionStatus === "open") {
              itemsData.push(itemData);
            }
          }

        case 17:
          i++;
          _context.next = 11;
          break;

        case 20:
          res.status(200).json({
            items: itemsData
          });
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](1);
          console.error('Error fetching items:', _context.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 23]]);
});
module.exports = router;