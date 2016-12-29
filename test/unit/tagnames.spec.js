var kdb = require('../../lib/kairosdb');

describe("tagnames", function () {
  it("should get all existing tagnames", function (done) {
    var client = kdb.init(global.options.host, global.options.port);

    client.tagnames(function (err, tags) {
      if (err)
        return done(err);
      expect(tags.results).to.be.ok;
      tags = tags.results;
      expect(tags).to.not.be.empty;
      done();
    });
  });
});