var common = exports,
    assert = require('assert'),
    fs = require('fs'),
    Plate = require('../../lib/plates');

function get(name, extension) {
  try {
    return fs.readFileSync(__dirname + '/../templates/' +
                           name + '.' + extension).toString();
  } catch(e) {
    return null;
  }
};

common.render = function(name, data, map) {
  var plate = new Plate(),
      html = get(name, 'html');

  return plate.html(html).data(data).bind(map);
};

common.createTest = function(name) {
  return {
    topic: function() {
      this.out = get(name, 'out');
      this.data = JSON.parse(get(name, 'json') || "{}");

      return common.render(name, this.data);
    },
    'should merge data to markup': function(html) {
      assert.equal(html, this.out);
    }
  };
};
