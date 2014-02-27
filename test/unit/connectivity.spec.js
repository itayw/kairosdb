var kdb = require('../../lib/kairosdb');

describe("connectivity", function () {
  it("should access kairosdb without problems", function (done) {
    var client = kdb.init(global.options.host, global.options.port);
    client.version(function (err, version) {
      if (err)
        return done(err);
      version = version.version.indexOf('KairosDB');
      expect(version).to.equal(0);
      done();
    });
  });

  it("should fail accessing kairosdb that does not exist", function (done) {
    var client = kdb.init();
    client.version(function (err, version) {
      if (err)
        return done();
      try {
        version = version.version.indexOf('KairosDB');
        expect(version).to.equal(0);
      }
      catch (ex) {
        return done();
      }
      return done(new Error('This is wrong, the previous call should have resulted with error.'));
    });
  });

  it("should support specific api versions", function (done) {
    var client = kdb.init(global.options.host, global.options.port, {apiversion: 'v3'});
    client.version(function (err, version) {
      if (err)
        return done();
      return done(new Error('This is wrong, the previous call should have resulted with error.'));
    });
  });

  it("should output debug info", function (done) {
    //This is shown in coverage report
    var client = kdb.init(global.options.host, global.options.port, {debug: true});
    client.version(function (err, version) {
      if (err)
        return done(err);
      return done();
    });
  });

  it("should get the version", function (done) {
    var client = kdb.init(global.options.host, global.options.port, {debug: false});
    client.version(function (err, version) {
      if (err)
        return done(err);
      expect(version.version).to.be.ok;
      done();
    });
  });

  it("should get the version (no callback)", function (done) {
    var client = kdb.init(global.options.host, global.options.port, {debug: false});
    client.version();
    done();
  });
});