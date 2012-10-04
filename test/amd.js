var requirejs = require('requirejs');
var assert = require('assert');
var util = require('util');
var plates = require('../lib/plates');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

requirejs(['../lib/plates'],function(plates2) {
	console.log(util.inspect(plates));
	console.log(util.inspect(plates2));
	assert.equal(util.inspect(plates, true), util.inspect(plates2, true));
});