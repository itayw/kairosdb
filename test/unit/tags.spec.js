var kdb = require('../../lib/kairosdb');

describe("tags", function () {
  it("should query tags of a given metric", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    var data = {
      "start_relative": {
        "value": "1",
        "unit": "years"
      },
      "metrics": [
        {
          "name": "metric_for_or",                
          "tags": {
            "host": ["server2"]
          }
        }
      ]
    };

    client.tags(data, function (err, metrics) {
      if (err)
        return done(err);
      
      expect(metrics.queries).to.be.ok;
      metrics = metrics.queries;
      expect(metrics).to.not.be.empty;
      
      var metric = metrics[0].results[0];
      expect(metric.tags).to.be.ok;
      expect(metric.tags).to.have.property("host");
      expect('server2').to.be.oneOf(metric.tags.host);

      done();
    });
  });
});