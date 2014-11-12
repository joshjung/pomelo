var pomelo = require('../'),
  should = require('should'),
  mockBase = process.cwd() + '/test';

describe('pomelo', function() {
  describe('#createApp', function() {
    it('should create and get app and both should be the same instance', function() {
      var app = pomelo.createApp({base: mockBase});
      should.exist(app);

      should.exist(pomelo.app);
      should.strictEqual(app, pomelo.app);
    });
  });
});