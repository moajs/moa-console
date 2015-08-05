#!/usr/bin/env node
var Inflector = require('inflected');
var requireDirectory = require('require-directory');

/**
 * Module dependencies
 */

var nodepath = require('path');
var REPL = require('repl');
var fs = require('fs');

var current_path = process.cwd();

var model_path = './app/models';

/**
 * `Moa console`
 *
 * Enter the interactive console (aka REPL) for the app
 * in our working directory.
 */

module.exports = function() {
  require(current_path + '/db');
  var log4js = require('log4js');
  var log = log4js.getLogger();

  console.log();
  log.info('Starting app in interactive mode...'.debug);
  console.log();


  log.info('Welcome to the Moa console.');
  log.info(('( to exit, type ' + '<CTRL>+<C>' + ' )').grey);
  console.log();
  //
  // A = require('./models/activity');
  // console.log(A);
  //

  var models = requireDirectory(module, model_path);
  
  console.log('Available Entity: ');
  // 此处没有做递归，可能有bug
  for(var i in models){
    var name = Inflector.camelize(i);
    console.log('  - ' + name);
    global[name] = models[i];
  }

  var repl = REPL.start('Moa> ');
  try {
    history(repl, nodepath.join(process.env.HOME, '.node_history'));
  } catch (e) {
    log.verbose('Error finding console history:', e);
  }
  repl.on('exit', function(err) {
    if (err) {
      log.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
  
  repl.commands['.list'] = {
    help: 'Show Available Entity',
    action: function() {
      // var out = [];
      // repl.rli.history.forEach(function(v, k) {
      //   out.push(v);
      // });
      // repl.outputStream.write(out.reverse().join('\n') + '\n');
      //
      var models = requireDirectory(module, model_path);
  
      console.log('Available Entity: ');
      // 此处没有做递归，可能有bug
      for(var i in models){
        var name = Inflector.camelize(i);
        console.log('  - ' + name);
        global[name] = models[i];
      }
      
      repl.displayPrompt();
    }
  };
  
};



/**
 * REPL History
 * Pulled directly from https://github.com/tmpvar/repl.history
 * with the slight tweak of setting historyIndex to -1 so that
 * it works as expected.
 */

function history(repl, file) {

  try {
    var stat = fs.statSync(file);
    repl.rli.history = fs.readFileSync(file, 'utf-8').split('\n').reverse();
    repl.rli.history.shift();
    repl.rli.historyIndex = -1;
  } catch (e) {}

  var fd = fs.openSync(file, 'a'),
    reval = repl.eval;

  repl.rli.addListener('line', function(code) {
    if (code && code !== '.history') {
      fs.write(fd, code + '\n');
    } else {
      repl.rli.historyIndex++;
      repl.rli.history.pop();
    }
  });

  process.on('exit', function() {
    fs.closeSync(fd);
  });

  repl.commands['.history'] = {
    help: 'Show the history',
    action: function() {
      var out = [];
      repl.rli.history.forEach(function(v, k) {
        out.push(v);
      });
      repl.outputStream.write(out.reverse().join('\n') + '\n');
      repl.displayPrompt();
    }
  };
}