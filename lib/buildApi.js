'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = buildApi;

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _selectors = require('./selectors');

var _applyUrlWithPlaceholders = require('./applyUrlWithPlaceholders');

var _applyUrlWithPlaceholders2 = _interopRequireDefault(_applyUrlWithPlaceholders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pendingPromises = {};

var defaultConfigure = function defaultConfigure(options) {
  return options;
};
var defaultAfterResolve = function defaultAfterResolve(result) {
  return Promise.resolve(result);
};
var defaultAfterReject = function defaultAfterReject(result) {
  return Promise.reject(result);
};

function buildApi(endpoints) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var baseUrl = config.baseUrl,
      _config$configureOpti = config.configureOptions,
      configureOptions = _config$configureOpti === undefined ? defaultConfigure : _config$configureOpti,
      _config$configureHead = config.configureHeaders,
      configureHeaders = _config$configureHead === undefined ? defaultConfigure : _config$configureHead,
      _config$afterResolve = config.afterResolve,
      afterResolve = _config$afterResolve === undefined ? defaultAfterResolve : _config$afterResolve,
      _config$afterReject = config.afterReject,
      afterReject = _config$afterReject === undefined ? defaultAfterReject : _config$afterReject;


  return Object.keys(endpoints).reduce(function (acc, key) {
    var _endpoints$key = endpoints[key],
        path = _endpoints$key.path,
        required = _endpoints$key.required,
        normalizeArguments = _endpoints$key.method;


    var requiredPlaceholders = required || [];
    var placeholderRegexp = /:([^\/$]+)/g;
    var match = void 0;

    while (match = placeholderRegexp.exec(path)) {
      requiredPlaceholders.push(match[1]);
    }

    acc[key] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var normalizedArguments = normalizeArguments.apply(undefined, args);

      var placeholders = normalizedArguments.placeholders || {};
      var options = normalizedArguments.options || {};

      var augmentedOptions = _extends({}, options, {
        headers: configureHeaders(_extends({
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json'
        }, options.headers))
      });

      var missingPlaceholders = requiredPlaceholders.filter(function (key) {
        return !placeholders.hasOwnProperty(key);
      });

      if (missingPlaceholders.length > 0) {
        var message = 'The "' + key + '" API call cannot be performed. The following params were not specified: ' + missingPlaceholders.join(', ');
        console.error(message);
        var neverendingPromise = new Promise(function () {
          return 1;
        });
        neverendingPromise.noop = true;

        return neverendingPromise;
      }

      var promiseId = JSON.stringify([key, args]);

      if (pendingPromises[promiseId]) {
        return pendingPromises[promiseId];
      }

      var req = (0, _request2.default)(baseUrl, (0, _applyUrlWithPlaceholders2.default)(path, placeholders), configureOptions(augmentedOptions));

      pendingPromises[promiseId] = req;

      var promise = req.then(afterResolve).then(function (result) {
        delete pendingPromises[promiseId];
        return result;
      }).catch(function (error) {
        delete pendingPromises[promiseId];
        return Promise.reject(error);
      }).catch(function (result) {
        afterReject({
          result: result,
          options: options,
          api: key
        });
      });

      promise.actionName = key;
      promise.params = args;

      return promise;
    };

    acc[key].actionName = key;

    return acc;
  }, {});
};