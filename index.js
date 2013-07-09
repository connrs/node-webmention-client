var WebmentionClient = require('./lib/webmention-client');

function webmention(source, target, callback) {
  var client = new WebmentionClient();
  client.setSource(source);
  client.setTarget(target);
  client.setCallback(callback);
  client.mention();
}

module.exports = webmention;
