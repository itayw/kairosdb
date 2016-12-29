var kdb = require('../../lib/kairosdb');

describe("metricnames", function () {
  it("should get all existing metricnames", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    client.metricnames(function (err, metrics) {
      if (err)
        return done(err);
      expect(metrics.results).to.be.ok;
      metrics = metrics.results;
      expect(metrics).to.not.be.empty;
      done();
    });
  });
});