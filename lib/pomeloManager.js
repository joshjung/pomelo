var path = require('path'),
  fs = require('fs'),
  constants = require('./util/constants'),
  adminClient = require('pomelo-admin').adminClient,
  spawn = require('child_process').spawn;

var CONNECT_ERROR = 'Failed to connect to admin console server.',
    FILEREAD_ERROR = 'Failed to read the file, please check if the application is started legally.',
    CLOSEAPP_INFO = 'Closing the application......\nPlease wait......',
    ADD_SERVER_INFO = 'Successfully added server.',
    RESTART_SERVER_INFO = 'Successfully restarted server.',
    INIT_PROJ_NOTICE = '\nThe default admin user is: \n\n'+ '  username'.green + ': admin\n  ' + 'password'.green+ ': admin\n\nYou can configure admin users by editing adminUser.json later.\n ',
    SCRIPT_NOT_FOUND = 'Failed to find an appropriate script to run,\nplease check the current work directory or the directory specified by option `--directory`.\n'.red,
    LOG_DIR_NOT_FOUND = 'Logging directory not defined. Specify as Pomelo.manager.start({logDir: \'blah\'}).\n'.red,
    MASTER_HA_NOT_FOUND = 'Failed to find an appropriate masterha config file, \nplease check the current work directory or the arguments passed to.\n'.red,
    COMMAND_ERROR = 'Illegal command format. See `pomelo --help`.\n'.red,
    DAEMON_INFO = 'The application is now running in the background.\n';

/**
 * Init application at the given directory `path`.
 *
 * @param {String} path
 */
function init(path) {
  console.log(INIT_PROJ_NOTICE);
  connectorType(function(type) {
    emptyDirectory(path, function(empty) {
      if(empty) {
        process.stdin.destroy();
        createApplicationAt(path, type);
      } else {
        confirm('Destination is not empty, continue? (y/n) [no] ', function(force) {
          process.stdin.destroy();
          if(force) {
            createApplicationAt(path, type);
          } else {
            abort('Fail to init a project'.red);
          }
        });
      }
    });
  });
}

/**
 * Create directory and files at the given directory `path`.
 *
 * @param {String} ph
 */
function createApplicationAt(ph, type) {
  var name = path.basename(path.resolve(CUR_DIR, ph));
  copy(path.join(__dirname, '../template/'), ph);
  mkdir(path.join(ph, 'game-server/logs'));
  mkdir(path.join(ph, 'shared'));
  // rmdir -r
  var rmdir = function(dir) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
      var filename = path.join(dir, list[i]);
      var stat = fs.statSync(filename);
      if(filename === "." || filename === "..") {
      } else if(stat.isDirectory()) {
        rmdir(filename);
      } else {
        fs.unlinkSync(filename);
      }
    }
    fs.rmdirSync(dir);
  };
  setTimeout(function() {
    switch(type) {
      case '1':
         // use websocket
         var unlinkFiles = ['game-server/app.js.sio',
         'game-server/app.js.wss',
         'game-server/app.js.mqtt',
         'game-server/app.js.sio.wss',
         'game-server/app.js.udp',
         'web-server/app.js.https',
         'web-server/public/index.html.sio',
         'web-server/public/js/lib/pomeloclient.js',
         'web-server/public/js/lib/pomeloclient.js.wss',
         'web-server/public/js/lib/build/build.js.wss',
         'web-server/public/js/lib/socket.io.js'];
         for(var i = 0; i < unlinkFiles.length; ++i) {
            fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
         }
        break;
        case '2':
          // use socket.io
          var unlinkFiles = ['game-server/app.js',
          'game-server/app.js.wss',
          'game-server/app.js.udp',
          'game-server/app.js.mqtt',
          'game-server/app.js.sio.wss',
          'web-server/app.js.https',
          'web-server/public/index.html',
          'web-server/public/js/lib/component.json',
          'web-server/public/js/lib/pomeloclient.js.wss'];
          for(var i = 0; i < unlinkFiles.length; ++i) {
            fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
          }

          fs.renameSync(path.resolve(ph, 'game-server/app.js.sio'), path.resolve(ph, 'game-server/app.js'));
          fs.renameSync(path.resolve(ph, 'web-server/public/index.html.sio'), path.resolve(ph, 'web-server/public/index.html'));

          rmdir(path.resolve(ph, 'web-server/public/js/lib/build'));
          rmdir(path.resolve(ph, 'web-server/public/js/lib/local'));
          break;
        case '3':
          // use websocket wss
          var unlinkFiles = ['game-server/app.js.sio',
          'game-server/app.js',
          'game-server/app.js.udp',
          'game-server/app.js.sio.wss',
          'game-server/app.js.mqtt',
          'web-server/app.js',
          'web-server/public/index.html.sio',
          'web-server/public/js/lib/pomeloclient.js',
          'web-server/public/js/lib/pomeloclient.js.wss',
          'web-server/public/js/lib/build/build.js',
          'web-server/public/js/lib/socket.io.js'];
          for(var i = 0; i < unlinkFiles.length; ++i) {
            fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
          }

          fs.renameSync(path.resolve(ph, 'game-server/app.js.wss'), path.resolve(ph, 'game-server/app.js'));
          fs.renameSync(path.resolve(ph, 'web-server/app.js.https'), path.resolve(ph, 'web-server/app.js'));
          fs.renameSync(path.resolve(ph, 'web-server/public/js/lib/build/build.js.wss'), path.resolve(ph, 'web-server/public/js/lib/build/build.js'));
          break;
        case '4':
          // use socket.io wss
           var unlinkFiles = ['game-server/app.js.sio',
          'game-server/app.js',
          'game-server/app.js.udp',
          'game-server/app.js.wss',
          'game-server/app.js.mqtt',
          'web-server/app.js',
          'web-server/public/index.html',
          'web-server/public/js/lib/pomeloclient.js'];
          for(var i = 0; i < unlinkFiles.length; ++i) {
            fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
          }

          fs.renameSync(path.resolve(ph, 'game-server/app.js.sio.wss'), path.resolve(ph, 'game-server/app.js'));
          fs.renameSync(path.resolve(ph, 'web-server/app.js.https'), path.resolve(ph, 'web-server/app.js'));
          fs.renameSync(path.resolve(ph, 'web-server/public/index.html.sio'), path.resolve(ph, 'web-server/public/index.html'));
          fs.renameSync(path.resolve(ph, 'web-server/public/js/lib/pomeloclient.js.wss'), path.resolve(ph, 'web-server/public/js/lib/pomeloclient.js'));

          rmdir(path.resolve(ph, 'web-server/public/js/lib/build'));
          rmdir(path.resolve(ph, 'web-server/public/js/lib/local'));
          fs.unlinkSync(path.resolve(ph, 'web-server/public/js/lib/component.json'));
          break;
        case '5':
          // use socket.io wss
           var unlinkFiles = ['game-server/app.js.sio',
          'game-server/app.js',
          'game-server/app.js.wss',
          'game-server/app.js.mqtt',
          'game-server/app.js.sio.wss',
          'web-server/app.js.https',
          'web-server/public/index.html',
          'web-server/public/js/lib/component.json',
          'web-server/public/js/lib/pomeloclient.js.wss'];
          for(var i = 0; i < unlinkFiles.length; ++i) {
            fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
          }
          
          fs.renameSync(path.resolve(ph, 'game-server/app.js.udp'), path.resolve(ph, 'game-server/app.js'));
          rmdir(path.resolve(ph, 'web-server/public/js/lib/build'));
          rmdir(path.resolve(ph, 'web-server/public/js/lib/local'));
          break;
        case '6':
          // use socket.io
          var unlinkFiles = ['game-server/app.js',
          'game-server/app.js.wss',
          'game-server/app.js.udp',
          'game-server/app.js.sio',
          'game-server/app.js.sio.wss',
          'web-server/app.js.https',
          'web-server/public/index.html',
          'web-server/public/js/lib/component.json',
          'web-server/public/js/lib/pomeloclient.js.wss'];
          for(var i = 0; i < unlinkFiles.length; ++i) {
            fs.unlinkSync(path.resolve(ph, unlinkFiles[i]));
          }

          fs.renameSync(path.resolve(ph, 'game-server/app.js.mqtt'), path.resolve(ph, 'game-server/app.js'));
          fs.renameSync(path.resolve(ph, 'web-server/public/index.html.sio'), path.resolve(ph, 'web-server/public/index.html'));

          rmdir(path.resolve(ph, 'web-server/public/js/lib/build'));
          rmdir(path.resolve(ph, 'web-server/public/js/lib/local'));
          break;
        }
        var replaceFiles = ['game-server/app.js',
        'game-server/package.json',
        'web-server/package.json'];
        for(var j = 0; j < replaceFiles.length; j++) {
          var str = fs.readFileSync(path.resolve(ph, replaceFiles[j])).toString();
          fs.writeFileSync(path.resolve(ph, replaceFiles[j]), str.replace('$', name));
        }
        var f = path.resolve(ph, 'game-server/package.json');
        var content = fs.readFileSync(f).toString();
        fs.writeFileSync(f, content.replace('#', version));
      }, TIME_INIT);
}


/**
 * Start application.
 *
 * @param {Object} options options for `start` operation
 */
function start(options) {
  options = options || {};

  var absScript = options.appFile || path.resolve(options.directory, 'app.js');

  if (!fs.existsSync(absScript)) {
    abort(SCRIPT_NOT_FOUND, absScript);
  }

  var logDir = options.logDir || (options.directory ? path.resolve(options.directory, 'logs') : undefined);
  if (!logDir)
  {
    abort(LOG_DIR_NOT_FOUND);
  }

  if (!fs.existsSync(logDir)) {
    fs.mkdir(logDir);
  }
  
  var ls,
    type = options.type || constants.RESERVED.ALL,
    params = [absScript, 'env=' + options.env, 'type=' + type];

  if(!!options.id) {
    params.push('startId=' + options.id);
  }
  if (options.daemon) {
    ls = spawn(process.execPath, params, {detached: true, stdio: 'ignore'});
    ls.unref();
    console.log(DAEMON_INFO);
    process.exit(0);
  } else {
    ls = spawn(process.execPath, params);
    ls.stdout.on('data', function(data) {
      console.log(data.toString());
    });
    ls.stderr.on('data', function(data) {
      console.log(data.toString());
    });
  }
}

/**
 * List pomelo processes.
 *
 * @param {Object} opts options for `list` operation
 */
function list(opts) {
  var id = 'pomelo_list_' + Date.now();
  connectToMaster(id, opts, function(client) {
    client.request(co.moduleId, {signal: 'list'}, function(err, data) {
      if(err) {
        console.error(err);
      }
      var servers = [];
      for(var key in data.msg) {
        servers.push(data.msg[key]);
      }
      var comparer = function(a, b) {
        if (a.serverType < b.serverType) {
          return -1;
        } else if (a.serverType > b.serverType) {
          return 1;
        } else if (a.serverId < b.serverId) {
          return -1;
        } else if (a.serverId > b.serverId) {
          return 1;
        } else {
          return 0;
        }
      };
      servers.sort(comparer);
      var rows = [];
      rows.push(['serverId', 'serverType', 'pid', 'rss(M)', 'heapTotal(M)', 'heapUsed(M)', 'uptime(m)']);
      servers.forEach(function(server) {
        rows.push([server.serverId, server.serverType, server.pid, server.rss, server.heapTotal, server.heapUsed, server.uptime]);
      });
      console.log(cliff.stringifyRows(rows, ['red', 'blue', 'green', 'cyan', 'magenta', 'white', 'yellow']));
      process.exit(0);
    });
  });
}

/**
 * Add server to application.
 *
 * @param {Object} opts options for `add` operation
 */
function add(opts) {
  var id = 'pomelo_add_' + Date.now();
  connectToMaster(id, opts, function(client) {
    client.request(co.moduleId, { signal: 'add', args: opts.args }, function(err) {
      if(err) {
        console.error(err);
      }
      else {
        console.info(ADD_SERVER_INFO);
      }
      process.exit(0);
    });
  });
}

/**
 * Terminal application.
 *
 * @param {String} signal stop/kill
 * @param {Object} opts options for `stop/kill` operation
 */
function terminal(signal, opts) {
  console.info(CLOSEAPP_INFO);
  // option force just for `kill`
  if(opts.force) {
    if (os.platform() === constants.PLATFORM.WIN) {
      exec(KILL_CMD_WIN);
    } else {
      exec(KILL_CMD_LUX);
    }
    process.exit(1);
    return;
  }
  var id = 'pomelo_terminal_' + Date.now();
  connectToMaster(id, opts, function(client) {
    client.request(co.moduleId, {
      signal: signal, ids: opts.serverIds
    }, function(err, msg) {
      if(err) {
        console.error(err);
      }
      if(signal === 'kill') {
        if(msg.code === 'ok') {
          console.log('All the servers have been terminated!');
        } else {
          console.log('There may be some servers remained:', msg.serverIds);
        }
      }
      process.exit(0);
    });
  });
}

function restart(opts) {
  var id = 'pomelo_restart_' + Date.now();
  var serverIds = [];
  var type = null;
  if(!!opts.id) {
    serverIds.push(opts.id);
  }
  if(!!opts.type) {
    type = opts.type;
  }
  connectToMaster(id, opts, function(client) {
    client.request(co.moduleId, { signal: 'restart', ids: serverIds, type: type}, function(err, fails) {
      if(!!err) {
        console.error(err);
      } else if(!!fails.length) {
        console.info('restart fails server ids: %j', fails);
      } else {
        console.info(RESTART_SERVER_INFO);
      }
      process.exit(0);
    });
  });
}

function connectToMaster(id, opts, cb) {
  var client = new adminClient({
    username: opts.username,
    password: opts.password,
    md5: true
  });

  client.connect(id, opts.host, opts.port, function(err) {
    if(err) {
      abort(CONNECT_ERROR + err.red);
    }
    if(typeof cb === 'function') {
      cb(client);
    }
  });
}

/**
 * Start master slaves.
 *
 * @param {String} option for `startMasterha` operation
 */
function startMasterha(opts) {
  var configFile = path.join(opts.directory, constants.FILEPATH.MASTER_HA);
  if(!fs.existsSync(configFile)) {
    abort(MASTER_HA_NOT_FOUND);
  }
  var masterha = require(configFile).masterha;
  for(var i=0; i<masterha.length; i++) {
    var server = masterha[i];
    server.mode = constants.RESERVED.STAND_ALONE;
    server.masterha = 'true';
    server.home = opts.directory;
    runServer(server);
  }
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */
function emptyDirectory(path, fn) {
  fs.readdir(path, function(err, files) {
    if(err && 'ENOENT' !== err.code) {
      abort(FILEREAD_ERROR);
    }
    fn(!files || !files.length);
  });
}

/**
 * Prompt confirmation with the given `msg`.
 *
 * @param {String} msg
 * @param {Function} fn
 */
function confirm(msg, fn) {
  prompt(msg, function(val) {
    fn(/^ *y(es)?/i.test(val));
  });
}

/**
 * Prompt input with the given `msg` and callback `fn`.
 *
 * @param {String} msg
 * @param {Function} fn
 */
function prompt(msg, fn) {
  if(' ' === msg[msg.length - 1]) {
    process.stdout.write(msg);
  } else {
    console.log(msg);
  }
  process.stdin.setEncoding('ascii');
  process.stdin.once('data', function(data) {
    fn(data);
  }).resume();
}

/**
 * Exit with the given `str`.
 *
 * @param {String} str
 */
function abort(str, obj) {
  console.error(str, obj);
  process.exit(1);
}

/**
 * Copy template files to project.
 *
 * @param {String} origin
 * @param {String} target
 */
function copy(origin, target) {
  if(!fs.existsSync(origin)) {
    abort(origin + 'does not exist.');
  }
  if(!fs.existsSync(target)) {
    mkdir(target);
    console.log('   create : '.green + target);
  }
  fs.readdir(origin, function(err, datalist) {
    if(err) {
      abort(FILEREAD_ERROR);
    }
    for(var i = 0; i < datalist.length; i++) {
      var oCurrent = path.resolve(origin, datalist[i]);
      var tCurrent = path.resolve(target, datalist[i]);
      if(fs.statSync(oCurrent).isFile()) {
        fs.writeFileSync(tCurrent, fs.readFileSync(oCurrent, ''), '');
        console.log('   create : '.green + tCurrent);
      } else if(fs.statSync(oCurrent).isDirectory()) {
        copy(oCurrent, tCurrent);
      }
    }
  });
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path, fn) {
  mkdirp(path, 0755, function(err){
    if(err) {
      throw err;
    }
    console.log('   create : '.green + path);
    if(typeof fn === 'function') {
      fn();
    }
  });
}

/**
 * Get user's choice on connector selecting
 * 
 * @param {Function} cb
 */
function connectorType(cb) {
  prompt('Please select underly connector, 1 for websocket(native socket), 2 for socket.io, 3 for wss, 4 for socket.io(wss), 5 for udp, 6 for mqtt: [1]', function(msg) {
    switch(msg.trim()) {
      case '':
         cb(1);
         break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
         cb(msg.trim());
         break;
      default:
         console.log('Invalid choice! Please input 1 - 5.'.red + '\n');
         connectorType(cb);
         break;
    }
  });
}

/**
 * Run server.
 * 
 * @param {Object} server server information
 */
function runServer(server) {
  var cmd, key;
  var main = path.resolve(server.home, 'app.js');
  if(utils.isLocal(server.host)) {
    var options = [];
    options.push(main);
    for(key in server) {
      options.push(util.format('%s=%s', key, server[key]));
    }
    starter.localrun(process.execPath, null, options);
  } else {
    cmd = util.format('cd "%s" && "%s"', server.home, process.execPath);
    cmd += util.format(' "%s" ', main);
    for(key in server) {
      cmd += util.format(' %s=%s ', key, server[key]);
    }
    starter.sshrun(cmd, server.host);
  }
}

module.exports = {
  init: init,
  start: start,
  createApplicationAt: createApplicationAt,
  list: list,
  terminal: terminal,
  restart: restart,
  startMasterha: startMasterha
}