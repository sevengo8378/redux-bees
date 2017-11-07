'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidateRequests = invalidateRequests;
function invalidateRequests(apiCall) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return {
    type: 'requests/invalidate',
    payload: {
      actionName: apiCall.actionName,
      params: params
    }
  };
}