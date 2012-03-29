var vows = require('vows'),
    assert = require('assert'),
    Plates = require('../lib/plates');
    common = require('./common');

vows.describe('merge data into markup').addBatch({
  'when providing both data and markup': {

    '(1) a single tag with an `id` that corresponds to a `data-key`.': (

      function() {
        return common.createTest('test-1');
      }()

    ),

    '(2) a deeply nested tag with an `id` that corresponds to a `data-key`.': (

      function() {
        return common.createTest('test-2');
      }()

    ),

    '(3) a tag with an `id` that corresponds to a `data-key`, having a body of nested tags.': (

      function() {
        return common.createTest('test-3');
      }()

    ),

    '(4) a tag with an arbitrary attribute that corresponds to a `data-key`.': (

      function() {
        var map = Plates.Map();
        map.where('src').is('google.com').use('key1');
        map.where('src').is('yahoo.com').use('key2');

        return common.createTest('test-4', map);
      }()

    ),

    '(5) a tag with a class attribute whith a value that corresponds to a `data-key`.': (

      function() {
        var map = Plates.Map();
        map.where('class').is('hidden').use('key1');

        return common.createTest('test-5', map);
      }()

    ),


    '(6) a tag with a class attribute whith a value that corresponds to a `data-key`, a second map item.': (

      function() {
        var map = Plates.Map();
        map.where('class').is('hidden').use('key1');
        map.where('href').is('/foo').use('key2').as('href');

        return common.createTest('test-6', map);
      }()

    ),

    '(7) a map that redefines the default matching attribute of `id`.': (

      function() {
        var map = Plates.Map({
          where: 'class'
        });

        return common.createTest('test-7', map);
      }()

    ),

    '(8) using the insert shortcut.': (

      function() {
        var map = Plates.Map();
        map.where('href').is('/').insert('newurl');

        return common.createTest('test-8', map);
      }()

    ),

    '(9) iterate a collection.': (

      function() {
        var map = Plates.Map();
        map.where('href').is('/').insert('url');

        return common.createTest('test-9', map);
      }()

    ),

    '(10) a map that defines creating missing attributes.' : (

      function() {
        var map = Plates.Map({
          create: true
        });

        map.class('logo').use('url').as('src');
        map.where('name').is('first_name').use('fname').as('value');
        map.where('name').is('last_name').use('lname').as('value');

        return common.createTest('test-10', map);
      }()

    ),

   '(11) differing on "is" parameter only.': (

      function() {
        var map = Plates.Map();
        map.where('name').is('method').use('method').as('value');
        map.where('name').is('id').use('id').as('value');

        return common.createTest('test-11', map);
      }()

    ),

    '(12) iterate a collection of over an element with children.': (

      function() {
        return common.createTest('test-12');
      }()

    ),

    '(13) attributes can contain valid characters': (

      function() {
        var map = Plates.Map();
        map.where('href').is('aA1-_:/&#1235; ').insert('test');

        return common.createTest('test-13', map);
      }()

    ),

    '(14) It should be able to iterate over collections with maps': (

      function() {
        var map = Plates.Map();
        map.class("names").use("names");

        return common.createTest('test-14', map);
      }()

    ),

    '(15) It should be able to iterate over collections with multiple maps': (

      function() {
        var map = Plates.Map();
        map.where("href").is("placeholder").insert("link");
        map.class("names").use("names");

        return common.createTest('test-15', map);
      }()
    ),

    '(16) It should be able to iterate over simple arrays': (

      function() {
        return common.createTest('test-16');
      }()

    ),

    '(17) It should be able to iterate over deeply nested objects': (

      function() {
        return common.createTest('test-17');
      }()

    ),

    '(18) It should be able to see the classnames properly': (

      function() {
        var map = Plates.Map();
        map.class("username").use("username");
        map.class("name").use("name");

        return common.createTest('test-18', map);
      }()

    ),

    '(19) Replace partial value with a new value': (

      function() {
        var map = Plates.Map();
        map.where("href").is(/^bar/).replace(/bar/, 'bazz');

        return common.createTest('test-19', map);
      }()
    ),

    '(20) Replace partial value with a new value from the data object': (

      function() {
        var map = Plates.Map();
        map.where("href").has(/^bar/).use('test');

        return common.createTest('test-20', map);
      }()
    )

  }

}).export(module);
