var kdb = require('../../lib/kairosdb');

it("should access kairosdb without problems", function (done) {
  var client = kdb.init('192.168.0.6', 8082);
  client.version(function (err, version) {
    if (err)
      return done(err);
    version = version.indexOf('KairosDB');
    expect(version).to.equal(0);
    done();
  });
});

it("should fail accessing kairosdb that does not exist", function (done) {
  var client = kdb.init();
  client.version(function (err, version) {
    if (err)
      return done();
    return done(new Error('This is wrong, the previous call should have resulted with error.'));
  });
});

it("should support specific api versions", function (done) {
  var client = kdb.init('192.168.0.6', 8082, {apiversion: 'v3'});
  client.version(function (err, version) {
    if (err)
      return done();
    return done(new Error('This is wrong, the previous call should have resulted with error.'));
  });
});