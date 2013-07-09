var lookup = require('lookup-webmention-server');
var pingWebmentionServer = require('./ping-webmention-server');

function WebMentionClient() {}

WebMentionClient.prototype.setSource = function (source) {
  this._source = source;
};

WebMentionClient.prototype.setTarget = function (target) {
  this._target = target;
};

WebMentionClient.prototype.setCallback = function (callback) {
  this._callback = callback;
};

WebMentionClient.prototype.mention = function () {
  lookup(this._target, this._onLookup.bind(this));
};

WebMentionClient.prototype._onLookup = function (err, serverUrl) {
  this._err = err;
  this._serverUrl = serverUrl;

  if (err) {
    this._lookupError();
  }
  else if (!serverUrl) {
    this._lookupFail();
  }
  else {
    this._pingServer();
  }
};

WebMentionClient.prototype._lookupError = function () {
  this._callback(this._err);
};

WebMentionClient.prototype._lookupFail = function () {
  var result = {
    success: false,
    raw: null,
    data: {}
  };

  this._callback(null, result);
};

WebMentionClient.prototype._pingServer = function () {
  pingWebmentionServer(this._serverUrl, this._pingData(), this._callback);
};

WebMentionClient.prototype._pingData = function () {
  var data = {
    source: this._source,
    target: this._target
  };

  return data;
};

module.exports = WebMentionClient;
