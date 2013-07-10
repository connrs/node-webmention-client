var request = require('request');
var getServerUrl = require('./lib/get-server-url');

function LookupWebmentionServer() {}

LookupWebmentionServer.prototype.setTarget = function (target) {
  this._target = target;
};

LookupWebmentionServer.prototype.setCallback = function (callback) {
  this._callback = callback;
};

LookupWebmentionServer.prototype.lookup = function () {
  request(this._target, this._httpResponse.bind(this));
};

LookupWebmentionServer.prototype._httpResponse = function (err, response, body) {
  if (err) {
    this._callback(err);
  }
  else if (this._targetResponseIsError(response)) {
    this._callback();
  }
  else {
    getServerUrl(this._getLinkHeaders(response.headers), body, this._onGetServerUrl.bind(this));
  }
};

LookupWebmentionServer.prototype._targetResponseIsError = function (response) {
  if (response.statusCode >= 400 && response.statusCode <= 500) {
    return true;
  }

  return false;
};

LookupWebmentionServer.prototype._getLinkHeaders = function (headers) {
  var linkHeaders;

  if (Array.isArray(headers.link)) {
    linkHeaders =  headers.link;
  }
  else if (typeof headers.link === 'string') {
    linkHeaders = [ headers.link ];
  }
  else {
    linkHeaders = [];
  }

  return linkHeaders;
};

LookupWebmentionServer.prototype._onGetServerUrl = function (err, serverUrl) {
  if (err) {
    this._callback(err);
  }
  else if (!serverUrl) {
    this._callback();
  }
  else {
    this._callback(null, serverUrl);
  }
};

function lookup(target, callback) {
  var lookupServer = new LookupWebmentionServer();
  lookupServer.setTarget(target);
  lookupServer.setCallback(callback);
  lookupServer.lookup();
}

module.exports = lookup;
