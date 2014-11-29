/*!
 * Pomelo
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var fs = require('fs'),
  path = require('path'),
  application = require('./application'),
  manager = require('./pomeloManager');

/**
 * Expose `createApplication()`.
 *
 * @module
 */

var Pomelo = module.exports = {};

/**
 * Expose API to allow adding, removing, starting servers for custom build process (like Grunt, Gulp, etc.)
 */
Pomelo.manager = manager;

/**
 * Framework version.
 */

Pomelo.version = '1.1.2';

/**
 * Event definitions that would be emitted by app.event
 */
Pomelo.events = require('./util/events');

/**
 * auto loaded components
 */
Pomelo.components = {};

/**
 * auto loaded filters
 */
Pomelo.filters = {};

/**
 * auto loaded rpc filters
 */
Pomelo.rpcFilters = {};

/**
 * connectors
 */
Pomelo.connectors = {};
Pomelo.connectors.__defineGetter__('sioconnector', load.bind(null, './connectors/sioconnector'));
Pomelo.connectors.__defineGetter__('hybridconnector', load.bind(null, './connectors/hybridconnector'));
Pomelo.connectors.__defineGetter__('udpconnector', load.bind(null, './connectors/udpconnector'));
Pomelo.connectors.__defineGetter__('mqttconnector', load.bind(null, './connectors/mqttconnector'));

/**
 * pushSchedulers
 */
Pomelo.pushSchedulers = {};
Pomelo.pushSchedulers.__defineGetter__('direct', load.bind(null, './pushSchedulers/direct'));
Pomelo.pushSchedulers.__defineGetter__('buffer', load.bind(null, './pushSchedulers/buffer'));

var self = this;

/**
 * Create a pomelo application.
 *
 * @return {Application}
 * @memberOf Pomelo
 * @api public
 */
Pomelo.createApp = function (opts) {
  var app = application;
  app.init(opts);
  return self._app = app;
};

/**
 * Get application singleton
 */
Object.defineProperty(Pomelo, 'app', {
  get:function () {
    return self._app;
  }
});

/**
 * Auto-load bundled components with getters.
 */
fs.readdirSync(__dirname + '/components').forEach(autoLoad.bind(undefined, 'components', true));
fs.readdirSync(__dirname + '/filters/handler').forEach(autoLoad.bind(undefined, 'filters', true));
fs.readdirSync(__dirname + '/filters/rpc').forEach(autoLoad.bind(undefined, 'rpcFilters', false));

function autoLoad(type, defineOnPomelo, filename) {
  if (!/\.js$/.test(filename)) {
    return;
  }

  var name = path.basename(filename, '.js'),
    _load = load.bind(null, './components/', name);
  
  Pomelo[type].__defineGetter__(name, _load);

  if (defineOnPomelo)
    Pomelo.__defineGetter__(name, _load);
}

function load(path, name) {
  if (name) {
    return require(path + name);
  }
  return require(path);
}
