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
router.get('/payment/items/delivered', function _callee2(req, res) {
  var user_id, userDoc, userData, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user_id = req.body.user_id;
          _context2.prev = 1;

          if (user_id) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "User id is required"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(user_id).get());

        case 6:
          userDoc = _context2.sent;
          userData = userDoc.data();

          if (!(!userData || !userData.itemsDelivered)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: "User or itemsBought not found"
          }));

        case 10:
          result = userData.itemsDelivered;
          res.status(200).json(result);
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](1);
          console.error("Error:", _context2.t0);
          res.status(500).json({
            error: "Internal Server Error",
            message: _context2.t0.message
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 14]]);
});
router.post("/payment/pay/item", function _callee3(req, res) {
  var _req$body, buyerID, item_id, card_number, pin, isValid, userDoc, userData1, userData, i;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, buyerID = _req$body.buyerID, item_id = _req$body.item_id, card_number = _req$body.card_number, pin = _req$body.pin;
          _context3.prev = 1;
          isValid = false;

          if (card_number && pin) {
            isValid = true;
          }

          if (!isValid) {
            _context3.next = 22;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(buyerID).get());

        case 7:
          userDoc = _context3.sent;
          userData1 = userDoc.data();
          userData = userData1.itemsBought;
          i = 0;

        case 11:
          if (!(i < userData.length)) {
            _context3.next = 19;
            break;
          }

          if (!(userData[i] === item_id)) {
            _context3.next = 16;
            break;
          }

          _context3.next = 15;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(buyerID).update({
            itemsBought: userData.filter(function (itemId) {
              return itemId !== item_id;
            }),
            itemsDelivered: req.app.locals.admin.firestore.FieldValue.arrayUnion(item_id)
          }));

        case 15:
          return _context3.abrupt("return", res.status(200).send("Your payment was successful"));

        case 16:
          i++;
          _context3.next = 11;
          break;

        case 19:
          return _context3.abrupt("return", res.status(500).json("Item not found in user's bought items"));

        case 22:
          return _context3.abrupt("return", res.status(500).json("Your payment was not successful"));

        case 23:
          _context3.next = 29;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](1);
          console.error("Error processing payment:", _context3.t0);
          return _context3.abrupt("return", res.status(500).json("Internal Server Error"));

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 25]]);
});
module.exports = router;