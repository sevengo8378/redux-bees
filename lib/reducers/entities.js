'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;

var _objectPathImmutable = require('object-path-immutable');

var _objectPathImmutable2 = _interopRequireDefault(_objectPathImmutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  if (!action.meta || !action.meta.api) {
    return state;
  }

  var metaType = action.meta.type;


  if (metaType === 'response' && action.payload && action.payload.body) {
    var newState = state;
    var _action$payload$body = action.payload.body,
        data = _action$payload$body.data,
        included = _action$payload$body.included;


    var items = void 0;

    if (Array.isArray(data)) {
      items = data;
    } else if (data) {
      items = [data];
    } else {
      items = [];
    }

    if (Array.isArray(included)) {
      items = items.concat(included);
    }

    newState = items.reduce(function (acc, item) {
      return _objectPathImmutable2.default.set(acc, [item.type, item.id], item);
    }, newState);

    return newState;
  }

  return state;
}