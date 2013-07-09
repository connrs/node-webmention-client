function matchWebmentionServer(header) {
  return header.match(/<(https?:\/\/[^>]+)>; rel=\"http:\/\/webmention.org\/\"/);
}

module.exports = matchWebmentionServer;
