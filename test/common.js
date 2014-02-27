var
  path = require('path');

global.sinon = require('sinon');
global.should = require('should');
global.assert = require('assert');
global._ = require('underscore');
var chai = require('chai');
chai.use(require('sinon-chai'));
global.expect = chai.expect;

global.options = {
  host: '192.168.0.6',
  port: 8082
};