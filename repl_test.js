// repl_test.js
var repl = require("repl"),
    msg = "message";

repl.start("> ").context.m = msg;