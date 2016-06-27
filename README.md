# Replacement for web3.shh

Connects to a running instance of 
[insecure-ethereum-p2p-proxy](https://github.com/ise-ethereum/insecure-ethereum-p2p-proxy)
and makes it available via an API similar to [web3.shh](https://github.com/ethereum/wiki/wiki/Whisper-Overview).

Installation:

    npm install --save ise-ethereum/web3-shh-dropin-for-proxy

Usage:

    var shhFactory = require('web3-shh-dropin-for-proxy');
    var proxyUri = 'http://localhost:1234';

    shhFactory(proxyUri, function(shh) {
      var appName = "My silly app!";
      var myName = "Gav Would";
      var identity = shh.newIdentity();

      var replyWatch = shh.watch({
        "topic": [ appName ],
        "to": identity
      });
      replyWatch.arrived(function(m) {
        assert.equal(m.payload.join(' '), 'What is your name? ' + myName);
      });

      replyWatch.remove(); // Remove all watchers on this topic
    });