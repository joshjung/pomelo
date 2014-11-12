var BackendSessionService = require('../common/service/backendSessionService');

module.exports = function (app) {
  var service = new BackendSessionService(app);
  service.name = '__backendSession__';
  // export backend session service to the application context.
  app.set('backendSessionService', service, true);

  // for compatibility
  app.set('localSessionService', service, true);

  return service;
};