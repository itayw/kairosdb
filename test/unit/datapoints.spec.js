var kdb = require('../../lib/kairosdb');

describe("datapoints", function () {
  it("should save a datapoint", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    var data = [
      {
        "name": "metric_for_or",
        "timestamp": new Date().getTime(),
        "value": 321,
        "tags": {
          "host": "server2"
        }
      }
    ];

    client.datapoints(data, function (err, result) {
      if (err)
        return done(err);
      done();
    });
  });

  it("should save multiple datapoints", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    var data = [
      {
        "name": "archive_file_tracked",
        "datapoints": [
          [1359788400000, 123],
          [1359788300000, 13.2],
          [1359788410000, 23.1]
        ],
        "tags": {
          "host": "server1",
          "data_center": "DC1"
        }
      },
      {
        "name": "archive_file_search",
        "timestamp": 1359786400000,
        "value": 321,
        "tags": {
          "host": "server2"
        }
      }
    ];

    client.datapoints(data, function (err, result) {
      if (err)
        return done(err);
      done();
    });
  });

  it("should fail on invalid json", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    var data = '[{"name":metric_for_or","timestamp":1393509598745,"value":321,"tags":{"host":"server2"}}]';

    client.datapoints(data, function (err, result) {
      if (err)
        return done();
      return done(new Error('This is wrong, the previous call should have resulted with error.'));
    });
  });

  it("should fail on invalid timestamp", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    var data = [
      {
        "name": "metric_for_or",
        "timestamp": 'astring',
        "value": 321,
        "tags": {
          "host": "server2"
        }
      }
    ];

    client.datapoints(data, function (err, result) {
      if (err)
        return done();
      return done(new Error('This is wrong, the previous call should have resulted with error.'));
    });
  });

  it("should save multilevel dimensions", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    var data = [
      {
        "name": "metric_for_or2",
        "timestamp": new Date().getTime(),
        "value": 321,
        "tags": {
          "host": "server2",
          "realm":  "unknown"
        }
      }
    ];

    client.datapoints(data, function (err, result) {
      if (err)
        return done(err);
      return done();
    });
  });
});