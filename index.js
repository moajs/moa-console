#!/usr/bin/env node

var file_path = __dirname;
console.log(__dirname)
var paths = __dirname.split('/');
paths.shift();
var npm_path = paths.join('/');

var main = require('/'+npm_path + '/main');

console.log(npm_path)

var fs = require('fs');

var current_path = process.cwd();

var is_db_config_exist = fs.existsSync(current_path + '/db.js');

if(is_db_config_exist == true){
  main();
}else{
  console.log('no db.js for mongodb connection,maybe it is not a moa project, or not in moa project root directory!');
  
  process.exit();
}

