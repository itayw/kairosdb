var kdb = require('../../lib/kairosdb');

describe("tagvalues", function () {
  it("should get all existing tagvalues", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    client.tagvalues(function (err, tags) {
      if (err)
        return done(err);
      expect(tags.results).to.be.ok;
      tags = tags.results;
      expect(tags).to.not.be.empty;
      done();
    });
  });
});