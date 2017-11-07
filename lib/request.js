'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = request;
/**
 * Runs the redux-bees api request.
 * The baseUrl can also be a function which is assessed at runtime.
 *
 * @param {String|Function} baseUrl
 * @param {String} path
 * @param {Object} options
 * @return {Promise}
 */

function request(baseUrl, path, options) {
  var url = (typeof baseUrl === 'function' ? baseUrl() : baseUrl) + path;
  return fetch(url, options).then(function (res) {
    var headers = {};
    res.headers.forEach(function (value, name) {
      return headers[name] = value;
    });

    var response = {
      status: res.status,
      headers: headers,
      url: res.url
    };

    if (res.status !== 204 && res.status !== 404) {
      // 404 may encounter SyntaxError: Unexpected token < in JSON at position 0 
      try {
        return res.json().then(function (body) {
          return _extends({}, response, { body: body });
        });
      } catch (err) {
        return Promise.resolve(response);
      }
    }

    return Promise.resolve(response);
  }).then(function (response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }

    return Promise.reject(response);
  });
};