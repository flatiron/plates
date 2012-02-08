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

    )
  }

}).export(module);

