var assert = require('chai').assert;

var testPort = 1234;
var createServer = require('insecure-ethereum-p2p-proxy/server');
createServer(testPort);

var uri = 'http://localhost:' + testPort;

var shhFactory = require('./shh');

describe('SHH', function() {
  it('should implement basic API', function (done) {
    shhFactory(uri, function(shh) {
      var appName = "My silly app!";
      var myName = "Gav Would";
      var identity1 = shh.newIdentity();

      var replyWatch = shh.watch({
        "topic": [ appName ],
        "to": identity1
      });
      replyWatch.arrived(function(m) {
        assert.equal(m.payload.join(' '), 'What is your name? ' + myName);
        done();
      });

      shhFactory(uri, function(shh) {
        var identity2 = shh.newIdentity();
        shh.post({
          "from": identity2,
          "to": identity1,
          "topic": [ appName ],
          "payload": [ "What is your name?", myName ]
        });
      });
    });
  });});
