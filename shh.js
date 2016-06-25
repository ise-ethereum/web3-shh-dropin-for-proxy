var io = require('socket.io-client');
var uuid = require("uuid");

var shhFactory = function(uri, next) {
  var instance = {
    watchers: {},

    connect: function(uri) {
      this.socket = io.connect(uri);
    },

    newIdentity: function() {
      this.identity = '0x' + uuid.v4().replace(/\-/g, '').substr(0,20);
      this.socket.emit('register', {address: this.identity});
      return this.identity;
    },

    post: function(options) {
      if (typeof options.topic != 'undefined') {
        options.topic = options.topic.join('');
      }
      this.socket.emit('send', options);
    },

    watch: function(options) {
      var topic = '';
      if (typeof options.topic != 'undefined') {
        topic = options.topic.join('');
      }
      var ev = {arrived: function(fun){
        if (typeof instance.watchers[topic] == 'undefined') {
          instance.watchers[topic] = [fun];
        } else {
          instance.watchers[topic].push(fun);
        }  
      }};
      return ev;
    },

    arrivedTopic: function(topic, data) {
      if (typeof this.watchers[topic] == 'undefined') {
        // Message for not-watched topic.
        return;
      }
      this.watchers[topic].forEach(function(watcher) {
        watcher(data);
      });
    }
  };
  instance.connect(uri);
  instance.socket.on('connect', function() {
    if (typeof next == 'function') {
      next(instance);
    }
  });
  instance.socket.on('receive', function(data) {
    instance.arrivedTopic(data.topic, data);
  });
  return instance;
};

module.exports = shhFactory;