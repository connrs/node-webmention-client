var request = require('request');

function PingWebmentionServer() {}

PingWebmentionServer.prototype.setUrl = function (url) {
  this._url = url;
};

PingWebmentionServer.prototype.setData = function (data) {
  this._data = data;
};

PingWebmentionServer.prototype.setCallback = function (callback) {
  this._callback = callback;
};

PingWebmentionServer.prototype.ping = function () {
  request(this._getRequestOptions(), this._serverResponse.bind(this));
};

PingWebmentionServer.prototype._serverResponse = function (err, response, body) {
  this._response = response;
  this._body = body;

  if (err) {
    this._callback(err);
  }
  else if (!this._pingResponseIsSuccess()) {
    this._callbackWithFailureResponse();
  }
  else {
    this._callbackWithSuccessResponse();
  }
};

PingWebmentionServer.prototype._getRequestOptions = function () {
  var requestOptions = {
    url: this._url,
    headers: {
      Accept: 'application/json'
    },
    form: this._data
  };

  return requestOptions;
};

PingWebmentionServer.prototype._pingResponseIsSuccess = function () {
  return this._response.statusCode === 202;
};

PingWebmentionServer.prototype._callbackWithSuccessResponse = function () {
  var result = {
    success: true,
    raw: this._body
  };

  if (this._responseIsJSON()) {
    result.data = this._parseJSONResponse();
  }

  this._callback(null, result);
};

PingWebmentionServer.prototype._callbackWithFailureResponse = function () {
  var result = {
    success: false,
    raw: this._body
  };

  if (this._responseIsJSON()) {
    result.data = this._parseJSONResponse();
  }

  this._callback(null, result);
};

PingWebmentionServer.prototype._responseIsJSON = function () {
  return this._response.headers['content-type'] && this._response.headers['content-type'].match(/application\/json/);
};

PingWebmentionServer.prototype._parseJSONResponse = function () {
  try {
    return JSON.parse(this._body);
  }
  catch (e) {
    return null;
  }
};

function doPing(url, data, callback) {
  var ping = new PingWebmentionServer();
  ping.setUrl(url);
  ping.setData(data);
  ping.setCallback(callback);
  ping.ping();
}

module.exports = doPing;
