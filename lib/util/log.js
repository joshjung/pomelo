var logger = require('pomelo-logger');

/**
 * Configure pomelo logger
 */
module.exports.configure = function(app, filename) {
  var serverId = app.getServerId(),
    base = app.getBase();

  logger.configure(filename, {
    serverId: serverId,
    base: base
  });
};
