"use strict";

var express = require('express');

var router = express.Router(); // intialize the DB of the user

router.post('/users/signup', function _callee(req, res) {
  var _req$body, email, password, name, address, userRecord, _userRecord;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password, name = _req$body.name, address = _req$body.address; // Check if any of the required fields are empty

          if (!(!email || !password || !name || !address)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Missing required fields in request body'
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(req.app.locals.admin.auth().getUserByEmail(email));

        case 6:
          userRecord = _context.sent;
          res.status(200).json({
            message: 'User is signed in.',
            userId: userRecord.uid
          });
          _context.next = 30;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);

          if (!(_context.t0.code === 'auth/user-not-found')) {
            _context.next = 28;
            break;
          }

          _context.prev = 13;
          _context.next = 16;
          return regeneratorRuntime.awrap(req.app.locals.admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
            address: address
          }));

        case 16:
          _userRecord = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(_userRecord.uid).set({
            email: email,
            name: name,
            items: [],
            itemsWon: [],
            itemsBought: [],
            auctionEntered: [],
            address: address
          }));

        case 19:
          res.status(201).json({
            message: 'User created successfully',
            userId: _userRecord.uid
          });
          _context.next = 26;
          break;

        case 22:
          _context.prev = 22;
          _context.t1 = _context["catch"](13);
          console.error('Error creating user:', _context.t1);
          res.status(500).json({
            error: 'Make sure all the required fields are added'
          });

        case 26:
          _context.next = 30;
          break;

        case 28:
          console.error('Error checking user existence:', _context.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10], [13, 22]]);
}); // to retrieve the dashboard of the user himself

router.get('/dashboard/:userId', function _callee2(req, res) {
  var userId, userDoc, userData;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(userId).get());

        case 4:
          userDoc = _context2.sent;

          if (userDoc.exists) {
            _context2.next = 8;
            break;
          }

          res.status(404).json({
            error: 'User not found'
          });
          return _context2.abrupt("return");

        case 8:
          userData = userDoc.data();
          res.status(200).json({
            userData: userData
          });
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error('Error retrieving user dashboard:', _context2.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
module.exports = router;