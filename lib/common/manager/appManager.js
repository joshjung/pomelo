var async = require('async');
var utils = require('../../util/utils');
var logger = require('pomelo-logger').getLogger('pomelo', __filename);
var transactionLogger = require('pomelo-logger').getLogger('transaction-log', __filename);
var transactionErrorLogger = require('pomelo-logger').getLogger('transaction-error-log', __filename);

var manager = module.exports;

manager.transaction = function(name, conditions, handlers, retry) {
	if(!retry) {
    retry = 1;
  }

  if(typeof name !== 'string') {
    logger.error('Transaction name formatting error, name was not a string: %s.', name);
    return;
  }

  if(typeof conditions !== 'object') {
    logger.error('Transaction conditions error, conditions was not an object: %j', conditions);
    return;
  }

  if(typeof handlers !== 'object') {
    logger.error('Transaction handlers error, handlers was not an object: %j', handlers);
    return;
  }

  var cmethods=[],
    dmethods=[],
    cnames=[],
    dnames=[];

  for(var key in conditions) {
    if(typeof key !== 'string' || typeof conditions[key] !== 'function') {
      logger.error('Transaction conditions object format error. Condition \'%s\' was not a function: %j.', key, conditions[key]);
      return;
    }
    cnames.push(key);
    cmethods.push(conditions[key]);
  }

  var i = 0;
  // execute conditions
  async.forEachSeries(cmethods, function(method, cb) {
    method(cb);
    transactionLogger.info('[%s]:[%s] condition is executed.', name, cnames[i]);
    i++;
  }, function(err) {
    if(err) {
      process.nextTick(function() {
        transactionLogger.error('[%s]:[%s] condition executed with err: %j.', name, cnames[--i], err.stack);
        var log = {
          name: name,
          method: cnames[i],
          time: Date.now(),
          type: 'condition',
          description: err.stack
        };
        transactionErrorLogger.error(JSON.stringify(log));
      });
      return;
    } else {
      // execute handlers
      process.nextTick(function() {
        for(var key in handlers) {
          if(typeof key !== 'string' || typeof handlers[key] !== 'function') {
            logger.error('Transaction handlers object format error. Handler \'%s\' was not a function: %j.', key, handlers[key]);
            return;
          }
          dnames.push(key);
          dmethods.push(handlers[key]);
        }

        var flag = true;
        var times = retry;
        
        // do retry if failed util retry times
        async.whilst(
          function() {
            return retry > 0 && flag;
          },
          function(callback) {
            var j = 0;
            retry--;
            async.forEachSeries(dmethods, function(method, cb) {
              method(cb);
              transactionLogger.info('[%s]:[%s] handler is executed.', name, dnames[j]);
              j++;
            }, function(err) {
              if(err) {
                process.nextTick(function() {
                  transactionLogger.error('[%s]:[%s]:[%s] handler executed with error: %j.', name, dnames[--j], times-retry, err.stack);
                  var log = {
                    name: name,
                    method: dnames[j],
                    retry: times-retry,
                    time: Date.now(),
                    type: 'handler',
                    description: err.stack
                  };
                  transactionErrorLogger.error(JSON.stringify(log));
                  utils.invokeCallback(callback);
                });
                return;
              }
              flag = false;
              utils.invokeCallback(callback);
              process.nextTick(function() {
                transactionLogger.info('[%s] all conditions and handlers executed successfully.', name);
              });
            });
          },
          function(err) {
            if(err) {
              logger.error('Transaction process executed with error: %j', err);
            }
            // callback will not pass error
          }
        );
      });
    }
  });
};