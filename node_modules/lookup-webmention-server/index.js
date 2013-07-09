var request = require('request');
var matchWebmentionServer = require('./lib/match-webmention-server.js');

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
    return;
  }

  if (this._targetResponseIsError(response)) {
    this._callback();
    return;
  }

  var serverUrl = this._getWebmentionServerUrl(this._getLinkHeaders(response.headers));

  if (!serverUrl) {
    this._callback();
    return;
  }

  this._callback(null, serverUrl);
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

LookupWebmentionServer.prototype._getWebmentionServerUrl = function (linkHeaders) {
  var linkHeader = linkHeaders.filter(filterWebmentionServers).map(mapWebmentionServers)[0];

  return linkHeader;
};

function filterWebmentionServers(header) {
  var match = matchWebmentionServer(header);

  return match.length === 2;
}

function mapWebmentionServers(header) {
  var match = matchWebmentionServer(header);

  if (match.length === 2) {
    return match[1];
  }
}

function lookup(target, callback) {
  var lookupServer = new LookupWebmentionServer();
  lookupServer.setTarget(target);
  lookupServer.setCallback(callback);
  lookupServer.lookup();
}

module.exports = lookup;
