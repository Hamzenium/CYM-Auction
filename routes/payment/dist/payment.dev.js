"use strict";

var express = require('express');

var router = express.Router();
router.get('/payment/items/bought', function _callee(req, res) {
  var user_id, userDoc, userData, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          user_id = req.body.user_id;
          _context.prev = 1;

          if (user_id) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "User id is required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(user_id).get());

        case 6:
          userDoc = _context.sent;
          userData = userDoc.data();

          if (!(!userData || !userData.itemsBought)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: "User or itemsBought not found"
          }));

        case 10:
          result = userData.itemsBought;
          res.status(200).json(result);
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](1);
          console.error("Error:", _context.t0);
          res.status(500).json({
            error: "Internal Server Error",
            message: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 14]]);
});
module.exports = router;