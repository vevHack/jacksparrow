#!/usr/bin/env node
var assert = require("assert");
var Mustache = require("./mustache.js");
var input = "";
var loader = process.argv[2];

assert(loader);

process.stdin.resume();
process.stdin.on("data", function(chunk) {
    input += chunk;
});
process.stdin.on("end", function() {
    process.stdout.write(Mustache.render(input, {loader: loader}));
});
