# Lookup WebMention Server

[![Travis CI Test Status](https://travis-ci.org/connrs/node-lookup-webmention-server.png)](https://travis-ci.org/connrs/node-lookup-webmention-server)

Discover the [WebMention](http://webmention.org/) server for a given URL.

## Usage

    var lookup = require('lookup-webmention-server');

    lookup('http://example.org/blog/post', function (err, url) {
      if (err) {
        // Handle errors
      }

      // do stuff with the URL!
    });

## API

    lookup(target, callback);

The `target` is the location that you have mentioned and wish to WebMention. The `callback` parameter is a callback function that is called:

    callback(err, url);

The `err` parameter is any potential error encountered during the HTTP request.

The `url` parameter is a string containing the URL to the WebMention server.
