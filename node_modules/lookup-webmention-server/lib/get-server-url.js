var jsdom = require('jsdom');

function getServerUrl(linkHeaders, body, callback) {
  var url = findUrlFromLinkHeaders(linkHeaders);

  if (url) {
    callback(null, url);
  }
  else {
    findUrlFromBody(body, callback);
  }
}

function findUrlFromLinkHeaders(linkHeaders) {
  return linkHeaders.filter(filterWebmentionServers).map(mapWebmentionServers)[0];
}

function findUrlFromBody(body, callback) {
  var params = {
    html: body,
    scripts: [],
    done: function (err, window) {
      var linkElements;
      var l;

      if (err) {
        callback(err);
      }
      else {
        linkElements = window.document.getElementsByTagName('link');

        for (l in linkElements) {
          if (linkElements.hasOwnProperty(l)) {
            if (relIsWebmentionMatch(linkElements[l].getAttribute('rel'))) {
              callback(null, linkElements[l].getAttribute('href'));
              return;
            }
          }
        }

        callback();
      }
    }
  };

  jsdom.env(params);
}

function relIsWebmentionMatch(rel) {
  return rel.match(/^http:\/\/webmention\.org/);
}

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

function matchWebmentionServer(header) {
  return header.match(/<(https?:\/\/[^>]+)>; rel=\"http:\/\/webmention.org\/\"/);
}

module.exports = getServerUrl;
