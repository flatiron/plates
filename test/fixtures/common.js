var common = exports,
    assert = require('assert'),
    fs = require('fs'),
    Plates = require('../../lib/plates');

function get(name, extension) {
  try {
    return fs.readFileSync(__dirname + '/../templates/' +
                           name + '.' + extension).toString();
  } catch(e) {
    return null;
  }
};

common.render = function(name, data, map) {
  var html = get(name, 'html');

  return Plates.bind(html, data, map);
};

common.createTest = function(name, map) {
  return {
    topic: function() {
      this.out = get(name, 'out');
      this.data = JSON.parse(get(name, 'json') || "{}");

      return {
        render: common.render(name, this.data, map),
      };
    },
    'should merge data to markup': function(result) {
      assert.equal(result.render, this.out);
    }
  };
};
