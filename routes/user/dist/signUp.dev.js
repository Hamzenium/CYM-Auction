"use strict";

var express = require('express');

var router = express.Router(); // intialize the DB of the user

router.post('/users/signup', function _callee(req, res) {
  var _req$body, email, password, name, address, userRecord, _userRecord;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password, name = _req$body.name, address = _req$body.address;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(req.app.locals.admin.auth().getUserByEmail(email));

        case 4:
          userRecord = _context.sent;
          res.status(200).json({
            message: 'User is signed in.',
            userId: userRecord.uid
          });
          _context.next = 28;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);

          if (!(_context.t0.code === 'auth/user-not-found')) {
            _context.next = 26;
            break;
          }

          _context.prev = 11;
          _context.next = 14;
          return regeneratorRuntime.awrap(req.app.locals.admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
            address: address
          }));

        case 14:
          _userRecord = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(req.app.locals.admin.firestore().collection('users').doc(_userRecord.uid).set({
            email: email,
            name: name,
            items: [],
            itemsWon: [],
            itemsBought: [],
            auctionEntered: [],
            address: address
          }));

        case 17:
          res.status(201).json({
            message: 'User created successfully',
            userId: _userRecord.uid
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t1 = _context["catch"](11);
          console.error('Error creating user:', _context.t1);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 24:
          _context.next = 28;
          break;

        case 26:
          console.error('Error checking user existence:', _context.t0);
          res.status(500).json({
            error: 'Internal server error'
          });

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8], [11, 20]]);
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