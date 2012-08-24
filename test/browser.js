"use strict";

/**
 * Browser.js: A simple conversion script that changes the existing vows test
 * suite in to a qunit compatible test suite.
 */

var fs = require('fs')
  , fixtures = './test/fixtures';

// generate the fixtures for the browser
fs.readdirSync(fixtures).forEach(function (file) {
  var content = fs.readFileSync(fixtures + '/' + file, 'utf8');

  console.log([
      '<script type="test/fixture" id="'+ file +'">'
    , content
    , '</script>'
  ].join('\n'));
});

var test = require('./api-test');
Object.keys(test).forEach(function (name) {
  var suite = test[name]
    , body = ['<script>'];

  suite.batches.forEach(function (test) {
    var wut = Object.keys(test)[0]
      , when = Object.keys(test[wut])[0];

    body.push('module("'+name + ', ' + when +'");');
    body.push('');

    Object.keys(test[wut][when]).forEach(function (expecting) {
      body.push('test("'+ expecting +'", function () {');
      body.push('');
      body.push('});');
      body.push('');
    });
  });

  body.push('</script>');

  // output the generated test suite
  console.log(body.join('\n'));
});
