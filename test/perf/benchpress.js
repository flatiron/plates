var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

var Mustache = require('mustache');
var Plates = require('../../lib/plates');

suite

  .add('mustache', function() {

  	var view = { "foo": "Hello, World" };
  	var template = '<div id="foo">{{foo}}</div><div class="foo">';

  	Mustache.to_html(template, view);

  })
  .add('plates', function() {

    var view = { "foo": "Hello, World" };
  	var template = '<div id="foo"></div><div class="foo">';

  	Plates.bind(template, view);

  })

  .on('cycle', function(event, bench) {
    console.log(String(bench));
  })

  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })

  .run(true);
