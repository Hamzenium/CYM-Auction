"use strict";

function updateSearchIndex(itemId, title, description, admin) {
  var combinedText, words, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, word, wordDoc;

  return regeneratorRuntime.async(function updateSearchIndex$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          combinedText = title + ' ' + description;
          words = combinedText.split(" ");
          _context.prev = 2;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 6;
          _iterator = words[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 23;
            break;
          }

          word = _step.value;
          _context.next = 12;
          return regeneratorRuntime.awrap(admin.firestore().collection('search').doc(word).get());

        case 12:
          wordDoc = _context.sent;

          if (!wordDoc.exists) {
            _context.next = 18;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(admin.firestore().collection('search').doc(word).update({
            itemIds: admin.firestore.FieldValue.arrayUnion(itemId)
          }));

        case 16:
          _context.next = 20;
          break;

        case 18:
          _context.next = 20;
          return regeneratorRuntime.awrap(admin.firestore().collection('search').doc(word).set({
            itemIds: [itemId]
          }));

        case 20:
          _iteratorNormalCompletion = true;
          _context.next = 8;
          break;

        case 23:
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](6);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 29:
          _context.prev = 29;
          _context.prev = 30;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 32:
          _context.prev = 32;

          if (!_didIteratorError) {
            _context.next = 35;
            break;
          }

          throw _iteratorError;

        case 35:
          return _context.finish(32);

        case 36:
          return _context.finish(29);

        case 37:
          console.log('Search index updated successfully');
          _context.next = 44;
          break;

        case 40:
          _context.prev = 40;
          _context.t1 = _context["catch"](2);
          console.error('Error updating search index:', _context.t1);
          throw _context.t1;

        case 44:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 40], [6, 25, 29, 37], [30,, 32, 36]]);
}

module.exports = updateSearchIndex;