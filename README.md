# Webmention Client

[![Travis CI Test Status](https://travis-ci.org/connrs/node-webmention-client.png)](https://travis-ci.org/connrs/node-webmention-client)

A simple client to ping a [WebMention](http://webmention.org/) service.

## Usage

    var webmention = require('webmention-client');
    var source = 'http://example.org/blog/my-latest-blog-post';
    var target = 'http://example.com/blog/interesting-blog-post-i-want-to-link-to';

    function webmentionComplete(err, response) {
      if (err) {
        // Handle error
        console.log(err, response);
      }
      else {
        // woot
        console.log(response);
      }
    }

    webmention(source, target, webmentionComplete);

## API

    webmention(sourceUrl, targetUrl, callback);

The `sourceUrl` is your URL, a blog post or article, that contains a link to the `targetUrl` at another location. The `callback` parameter is a callback function that is called:

    callback(err, result);

The `err` parameter is any potential error encountered during the HTTP request.

The `result` parameter is an object containing a `success` boolean and a `response` object. If the response is JSON, this will be available as the response object; if the response is blank or non-JSON, it will be available as `response.raw` instead. For further information, see the [WebMention specification](http://webmention.org/).
