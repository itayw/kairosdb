# KairosDB [![Build Status][3]][4] [![Coverage Status][1]][2]

####A node.js KairosDB client

This is a complete [KairosDB][KairosDB] client for node.js, it supports all KairosDB commands.

### Install

```bash
$ npm install kairosdb
```

### Usage
Simple example:

```javascript
var 
  kdb = require('kairosdb'),
  client = kdb.init();

client.version(function(err, version){
  console.log(version);
});
```
This will display:
```javascript
{
  "version": "KairosDB 0.9.3.20140127084223"
}
```
Pushing data points:
```javascript
var 
  kdb = require('kairosdb'),
  client = kdb.init();

  var data = [
    {
      "name": "metricname",
      "timestamp": new Date().getTime(),
      "value": 321,
      "tags": {
        "host": "server"
      }
    }
  ];

  client.datapoints(data, function (err, result) {
    if (err)
      throw err;
  });
```

### Sending Commands
Each KairosDB command is exposed as a function on the `client` object. All functions take an arguments object which are passed as the request body to KairosDB and a `callback` function. The callback function receives an `err` argument (null if none) and a `results` argument containing the server result (if any).
Here is an example of passing arguments and a callback:
```javascript
  var data = [
    {
      "name": "metricname",
      "timestamp": new Date().getTime(),
      "value": 321,
      "tags": {
        "host": "server"
      }
    }
  ];

  client.datapoints(data, function (err, result) {
    if (err)
      throw err;
  });
```
Minimal parsing is done on the replies. The library will try to `JSON.parse` the result string and pass it to the callback function.

## API

### `kairosdb.init(host, port, options)`
Create a new client connection. `host` default to `localhost` and `port` defaults to `8080`. If you have redis-server running on the same computer as node, then the defaults for port and host are probably fine.  
`options` is an object with the following possible properties:

- `debug`: enable print out to console of debug information.


### Contributing
I'd would love to get your help and have outlined a simple Contribution Policy to support a transparent and easy merging of ideas, code, bug fixes and features.
If you're looking for a place to start, you can always go over the list of open issues, pick one and get started. If you're feeling lost or unsure, just let me know.

###License
Copyright (c) 2014 Itay Weinberger. MIT Licensed, see LICENSE for details.


[1]: https://coveralls.io/repos/itayw/kairosdb/badge.png?branch=master
[2]: https://coveralls.io/r/itayw/kairosdb?branch=master
[3]: https://travis-ci.org/itayw/kairosdb.png?branch=master
[4]: https://travis-ci.org/itayw/kairosdb?branch=master

[KairosDB]: https://code.google.com/p/kairosdb/