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
        map.class("first").use("first");
        map.class("last").use("last");

        return common.createTest('test-14', map);
      }()

    ),

    '(15) It should be able to iterate over collections with multiple maps': (

      function() {
        var map = Plates.Map();
        map.where("href").is("placeholder").insert("link");
        map.class("names").use("names");
        map.class("first").use("first");
        map.class("middle").use("middle");
        map.class("last").use("last");

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
        map.where("href").has(/^bar/).insert('test');

        return common.createTest('test-20', map);
      }()

    ),

    '(21) Remove should remove the whole element': (

      function() {
        var map = Plates.Map();
        map.class('removed').remove();

        return common.createTest('test-21', map);
      }()

    ),

    '(22) Remove should remove self closing elements': (

      function() {
        var map = Plates.Map();
        map.where('type').is('email').remove();

        return common.createTest('test-22', map);
      }()

    ),

    '(23) Remove should remove self closing elements without optional ending slash': (

      function() {
        var map = Plates.Map();
        map.where('type').is('email').remove();

        return common.createTest('test-23', map);
      }()

    ),

    '(24) Should append new templates': (

      function() {
        var map = Plates.Map();
        map.class('insert').append('<div class="trolling"></div>');

        return common.createTest('test-24', map);
      }()

    ),

    '(25) New templates should also process map and custom data': (

      function() {
        var map = Plates.Map();
        var partial = Plates.Map();

        partial.class('trolling').to('boink');
        map.class('insert').append('<div class="trolling"></div>', { boink: 'moo' }, partial);

        return common.createTest('test-25', map);
      }()

    ),

    '(26) When the data for the partial was provided as a string, get it from the parent data structure': (

      function() {
        var map = Plates.Map();
        var partial = Plates.Map();

        partial.class('trolling').to('boink');
        map.class('insert').append('<div class="trolling"></div>', 'partial', partial);

        return common.createTest('test-26', map);
      }()

    ),

    '(27) append should read from file system if no template has been provided': (

      function() {
        var map = Plates.Map();
        var partial = Plates.Map();

        map.class('insert').append('./test/fixtures/partial-1.html');

        return common.createTest('test-27', map);
      }()

    ),

    '(28) it should repeat the partial for each item in the array': (

      function() {
        var map = Plates.Map();
        var partial = Plates.Map();

        map.class('insert').append('./test/fixtures/partial-1.html', [{}, {}, {}]);

        return common.createTest('test-28', map);
      }()

    ),

    '(29) a tag match without attributes should replace the contents': (

      function() {
        var map = Plates.Map();
        map.tag('div').use('foo');

        return common.createTest('test-29', map);
      }()

    ),

    '(30) use can be passed a function which returns the value': (

      function() {
        var map = Plates.Map();
        map.class('transformation').use(function (data, key) {
          return data.uppercase.toLowerCase();
        });

        return common.createTest('test-30', map);
      }()

    ),

    '(31) Two maps on the same class, one for attribute work if the attribute one comes last': (

      function() {
        var map = Plates.Map();
        map.class('author').to('name');
        map.class('author').use('url').as('href');

        return common.createTest('test-31', map);
      }()

    ),

    '(32) Two maps on the same class, one for attribute work if the attribute one comes first': (

      function() {
        var map = Plates.Map();
        map.class('author').use('url').as('href');
        map.class('doesnotexist').to('donotcare');
        map.class('author').to('name');

        return common.createTest('test-32', map);
      }()

    ),

    '(33) Two maps on the same attribute and value should throw': (


      function() {
        var map = Plates.Map();
        map.class('author').use('url').as('href');
        map.class('author').to('name');
        map.class('author').to('name');

        return {
          topic: function() {

            try {
              Plates.bind('<a></a>', {a:1}, map);
            } catch(err) {
              return {
                error: err
              };
            }
            return {};

          },
          'should throw': function(result) {
            assert.ok(!! result.error, 'Should have thrown');
            assert.equal(result.error.message, 'Conflicting mappings for attribute class and value author');
          }
        };

      }()

    ),

    '(34) Two maps for thr same class, updating two attributes should update both attributes': (

      function() {
        var map = Plates.Map();
        map.class('author').use('url').as('href');
        map.class('author').use('class').as('class');

        return common.createTest('test-34', map);
      }()

    ),

    '(35) Two maps for thr same class, updating two attributes plus a body class map should update both attributes': (

      function() {
        var map = Plates.Map();
        map.class('author').use('url').as('href');
        map.class('author').use('class').as('class');
        map.class('author').to('name');

        return common.createTest('test-35', map);
      }()

    ),

    '(36) complex nesting should work as expected': (

      function() {
        var map = Plates.Map();
        map.class('author').use('author');
        map.class('name').use('name');
        map.class('name').use('link').as('href');
        map.class('title').use('title');
        map.class('inner').use('inner');

        return common.createTest('test-36', map);
      }()

    ),

    '(37) complex nesting with arrays should work as expected': (

      function() {
        var map = Plates.Map();
        map.class('author').use('author');
        map.class('name').use('name');
        map.class('name').use('link').as('href');
        map.class('title').use('title');
        map.class('inner').use('inner');

        return common.createTest('test-37', map);
      }()

    ),

    '(38) spaces in attributes': (

      function() {
        var map = Plates.Map();
        map.class('inner').use('inner');

        return common.createTest('test-38', map);

      }()

    ),

    '(39) Nesting arrays with objects with arrays should work': (

      function() {
        var map = Plates.Map();

        map.className('author').to('author');

        return common.createTest('test-39', map);
      }()
    ),

    '(40) Nested objects can be accessed using dot notiation': (

      function() {
        var map = Plates.Map();

        map.className('zero').to('counts.zero');
        map.className('one').to('counts.one');
        map.className('banana').to('ringring');

        return common.createTest('test-40', map);
      }()
    ),

    '(41) Should remove the correct element': (

      function() {
        var map = Plates.Map();

        map.className('ssl').remove();

        return common.createTest('test-41', map);
      }()
    ),

    '(42) Should iterate from current position, to prevent double replacements': (

      function() {
        var map = Plates.Map();

        return common.createTest('test-42', map);
      }()
    ),

    '(43) Should replace correctly when attribute value contains quotes': (
      function(){
        var map = Plates.Map();

        return common.createTest('test-43', map);
      }()
    )
  }

}).export(module);
