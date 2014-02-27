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
  events.EventEmitter.call(this);
}
util.inherits(KairosDB, events.EventEmitter);
exports.KairosDB = KairosDB;

KairosDB.prototype.execute = function (endpoint, options, callback) {
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

  try {
    var req = http.request(_options, function (res) {
      if (self.options.debug) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
      }
      res.setEncoding('utf8');

      if (res.statusCode === 404)
        return callback(new Error('404: page not found'));
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

    req.end();
  }
  catch (ex) {
    return callback(ex);
  }
};

KairosDB.prototype.version = function (callback) {
  this.execute('version', {}, function (err, result) {
    if (err)
      return callback(err);
    try {
      var version = result.version;
      if (typeof version === 'undefined')
        return callback(new Error('Failed to fetch version.'));
      return callback(null, version);
    }
    catch (ex) {
      return callback(new Error('Failed to fetch version, ' + ex));
    }

  });
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