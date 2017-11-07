"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntity = getEntity;
exports.getRelationship = getRelationship;
exports.getRequestResult = getRequestResult;
exports.getRequestHeaders = getRequestHeaders;
exports.getRequestMeta = getRequestMeta;
exports.isRequestLoading = isRequestLoading;
exports.hasRequestStarted = hasRequestStarted;
exports.getRequestError = getRequestError;
exports.getRequestInfo = getRequestInfo;
function getRawRequest(state, apiCall, args) {
  var actionName = apiCall.actionName;


  if (!state.bees.requests) {
    return null;
  }

  if (!state.bees.requests[actionName]) {
    return null;
  }

  return state.bees.requests[actionName][JSON.stringify(args)];
}

function getEntity(state, handle) {
  if (!handle) {
    return null;
  }

  if (!state.bees.entities) {
    return null;
  }

  if (!state.bees.entities[handle.type]) {
    return null;
  }

  return state.bees.entities[handle.type][handle.id];
}

function getRelationship(state, entity, relationshipName) {
  if (!entity) {
    return null;
  }

  var data = entity.relationships[relationshipName].data;


  if (Array.isArray(data)) {
    return data.map(function (handle) {
      return getEntity(state, handle);
    });
  }

  return getEntity(state, data);
}

function getRequestResult(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);

  if (!request || !request.response) {
    return null;
  }

  if (Array.isArray(request.response)) {
    return request.response.map(function (handle) {
      return getEntity(state, handle);
    });
  }

  return getEntity(state, request.response);
}

function getRequestHeaders(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);
  return request && request.headers;
}

function getRequestMeta(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);
  return request && request.meta;
}

function isRequestLoading(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);
  return request && request.isLoading ? true : false;
}

function hasRequestStarted(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);

  if (!request) {
    return false;
  }

  if (request.invalid) {
    return false;
  }

  return true;
}

function getRequestError(state, apiCall, args) {
  var request = getRawRequest(state, apiCall, args);

  if (!request) {
    return false;
  }

  return request.error;
}

function getRequestInfo(state, apiCall, args) {
  var error = getRequestError(state, apiCall, args);

  return {
    hasStarted: hasRequestStarted(state, apiCall, args),
    isLoading: isRequestLoading(state, apiCall, args),
    hasFailed: !!error,
    result: getRequestResult(state, apiCall, args),
    headers: getRequestHeaders(state, apiCall, args),
    meta: getRequestMeta(state, apiCall, args),
    error: error
  };
}