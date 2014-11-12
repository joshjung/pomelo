var ConnectionService = require('../common/service/connectionService');

/**
 * Connection component for statistics connection status of frontend servers
 */
module.exports = function(app) {
  return new Component(app);
};

var Component = function(app) {
  this.app = app;
  this.service = new ConnectionService(app);

  // proxy the service methods except the lifecycle interfaces of component
  var method,
    self = this;

  for (var key in this.service) {
    if(key !== 'start' && key !== 'stop') {
      method = this.service[key];
      if(typeof method === 'function') {
        this[key] = bindFunction(key);
      }
    }
  }

  function bindFunction(key) {
    return (function() {
          return function() {
            return self.service[key].apply(self.service, arguments);
          };
    })();
  };
};

Component.prototype.name = '__connection__';