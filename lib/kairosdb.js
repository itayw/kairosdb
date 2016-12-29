var
  util = require('util'),
  events = require('events'),
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
    'datapoints',
    ['metricnames', 'GET'],
    ['tagnames', 'GET'],
    ['tagvalues', 'GET'],
    ['tags', 'POST', 'datapoints/query']
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
    uri: 'http://' + this.host + ':' + this.port + '/api/' + apiversion + '/' + endpoint,
    method: method
  };
  if (options.method === 'POST' && payload) {
    _options.headers = {
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(payload).length
    };
  }

  try {
    if (options.method === 'POST' && payload)
      _options.body = JSON.stringify(payload);
    
    request(_options, function (error, res, body) {
      if (error) {
        if (self.options.debug)
          console.log(error);
        return callback(error);
      }
      
      if (self.options.debug) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        console.log('BODY: ' + body);
      }

      var e = null;
      var resultObj = null;

      switch (res.statusCode) {
        case 200:
          resultObj = JSON.parse(body);
          break;
        case 204:
          resultObj = "";
          break;
        case 400:
          e = new Error('400: Bad Request');
          break;
        case 401:
          e = new Error('401: Unauthorized');
          break;
        case 403:
          e = new Error('403: Forbidden');
          break;
        case 404:
          e = new Error('404: Not Found');
          break;
        case 500:
          e = new Error('500: Internal Server Error');
          break;
        case 503:
          e = new Error('503: Service Unavailable');
          break;
        default:
          resultObj = body;
          break;
      }

      if (e) {
        e.statusCode = res.statusCode;
        e.body = body;
        return callback(e);
      }
      else {
        return callback(null, resultObj);
      }
    });
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

  kdb = new KairosDB(host, port, options);

  kdb.port = port;
  kdb.host = host;

  return kdb;
};