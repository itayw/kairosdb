var kdb = require('../../lib/kairosdb');

describe("query", function () {
  it("should do a basic query", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    var query = {
      "metrics": [
        {
          "tags": {},
          "name": "metric_for_or2",
          "aggregators": [
            {
              "name": "sum",
              "align_sampling": true,
              "sampling": {
                "value": "1",
                "unit": "milliseconds"
              }
            }
          ]
        }
      ],
      "cache_time": 0,
      "start_relative": {
        "value": "1",
        "unit": "years"
      }
    };

    client.query(query, function (err, result) {
      if (err)
        return done(err);
      
      done();
    });
  });
});