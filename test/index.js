var test = require('tape');
var webmention = require('../');
var http = require('http');
var host = 'localhost';
var port = 3001;

test('no WebMention server is found', function (t) {
  var source = 'http://' + host;
  var target = 'http://' + host + ':' + port + '/test2';
  var server = http.createServer(function (req, res) {
    res.end('test');
    req.connection.destroy();
  }).listen(port);

  webmention(source, target, function (err, response) {
    server.close();
    console.log(err);
    t.notOk(response.success);
    t.end();
  });
});

test('target server returns 4xx status code', function (t) {
  var source = 'http://' + host;
  var target = 'http://' + host + ':' + port + '/bad_url';
  var server = http.createServer(function (req, res) {
    res.statusCode = 404;
    res.setHeader('Link', '<http://example.org/webmention>; rel="http://webmention.org/"');
    res.end('test');
    req.connection.destroy();
  }).listen(port);

  webmention(source, target, function (err, response) {
    server.close();
    t.notOk(response.success);
    t.end();
  });
});

test('error looking up target server', function (t) {
  var source = 'http://' + host;
  var target = 'http://' + host + ':' + port + '/bad_url';

  webmention(source, target, function (err, response) {
    t.ok(err instanceof Error);
    t.end();
  });
});

test('pings the WebMention server', function (t) {
  var source = 'http://' + host;
  var target = 'http://' + host + ':' + port + '/good_url';
  var server = http.createServer(function (req, res) {
    if (req.url === '/good_url') {
      res.setHeader('Link', '<http://' + host + ':' + port + '/webmention>; rel="http://webmention.org/"');
      res.end('test');
    }
    else if (req.url === '/webmention') {
      res.statusCode = 202;
      res.end('success');
    }
    req.connection.destroy();
  }).listen(port);

  webmention(source, target, function (err, response) {
    server.close();
    t.error(err);
    t.ok(response.success);
    t.end();
  });
});

test('converts the JSON response to response.data', function (t) {
  var source = 'http://' + host;
  var target = 'http://' + host + ':' + port + '/good_url';
  var server = http.createServer(function (req, res) {
    if (req.url === '/good_url') {
      res.setHeader('Link', '<http://' + host + ':' + port + '/webmention>; rel="http://webmention.org/"');
      res.end('test');
    }
    else if (req.url === '/webmention') {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
      res.statusCode = 202;
      res.end(JSON.stringify({ result: 'WebMention was successful' }));
    }
    req.connection.destroy();
  }).listen(port);

  webmention(source, target, function (err, response) {
    server.close();
    t.error(err);
    t.ok(response.success);
    t.ok(response.data.result, 'WebMention was successful');
    t.end();
  });
});

test('adds the raw response to response.raw', function (t) {
  var source = 'http://' + host;
  var target = 'http://' + host + ':' + port + '/good_url';
  var server = http.createServer(function (req, res) {
    if (req.url === '/good_url') {
      res.setHeader('Link', '<http://' + host + ':' + port + '/webmention>; rel="http://webmention.org/"');
      res.end('test');
    }
    else if (req.url === '/webmention') {
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      res.statusCode = 202;
      res.end('WebMention was successful');
    }
    req.connection.destroy();
  }).listen(port);

  webmention(source, target, function (err, response) {
    server.close();
    t.error(err);
    t.ok(response.success);
    t.notOk(response.data);
    t.ok(response.raw, 'WebMention was successful');
    t.end();
  });
});
