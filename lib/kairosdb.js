var
  util = require('util'),
  events = require('events'),
  http = require('http'),
  request = require('request'),

  connection_id = 0,
  default_port = 8080,
  default_host = "127.0.0.1";

function KairosDB(host, port, options) {
  this.options = options = options || {};
  this.host = host;
  this.port = port;
  this.connection_id = ++connection_id;

  this.endpoints = [
    ['version', 'GET'],
    ['query', 'POST', 'datapoints'],
    'datapoints'
  ];

  this.buildStub();

  events.EventEmitter.call(this);
}
util.inherits(KairosDB, events.EventEmitter);
exports.KairosDB = KairosDB;

KairosDB.prototype.buildStub = function () {
  var self = this;
  this.endpoints.forEach(function (endpoint) {
    var name, method, parent;
    if (Array.isArray(endpoint)) {
      name = endpoint[0];
      if (endpoint.length > 1)
        method = endpoint[1];
      if (endpoint.length > 2)
        parent = endpoint[2];
    }
    else
      name = endpoint;

    if (!method)
      method = 'POST';

    self[name] = function (args, callback) {
      var url = name;
      if (parent)
        url = parent + '/' + url;
      if (!callback && typeof args === 'function')
        self.execute(url, {method: method}, null, args);
      else if (!callback)
        self.execute(url, {method: method}, args, function () {
        });
      else
        self.execute(url, {method: method}, args, callback);
    };
  });
};

KairosDB.prototype.execute = function (endpoint, options, payload, callback) {
  var self = this;

  var apiversion = 'v1';
  if (this.options.apiversion)
    apiversion = this.options.apiversion;
  var method = 'GET';
  if (options.method)
    method = options.method;

  var _options = {
    host: this.host,
    port: this.port,
    path: '/api/' + apiversion + '/' + endpoint,
    method: method
  };
  if (options.method === 'POST' && payload) {
    _options.headers = {
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(payload).length
    };
  }

  try {
    var req = http.request(_options, function (res) {
      if (self.options.debug) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
      }
      res.setEncoding('utf8');

      if (res.statusCode === 404)
        return callback(new Error('404: page not found'));
      else if (res.statusCode === 400) {
        return callback(new Error('400: server error'));
      }
      else if (res.statusCode === 500)
        return callback(new Error('500: server error'));

      var buffer = '';
      res.on('data', function (chunk) {
        if (self.options.debug)
          console.log('BODY: ' + chunk);
        buffer += chunk;
      });

      res.on('end', function () {
        try {
          buffer = JSON.parse(buffer);
        }
        catch (ex) {

        }
        return callback(null, buffer);
      });
    });

    req.on('error', function (err) {
      return callback(err);
    });

    if (options.method === 'POST' && payload)
      req.write(JSON.stringify(payload));

    req.end();
  }
  catch (ex) {
    return callback(ex);
  }
};

exports.init = function (host_arg, port_arg, options) {
  var
    port = port_arg || default_port,
    host = host_arg || default_host,
    kdb;

  kdb = new KairosDB(port, host, options);

  kdb.port = port;
  kdb.host = host;

  return kdb;
};