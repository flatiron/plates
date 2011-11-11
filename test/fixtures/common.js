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

common.render = function(name, data, map, method) {
  var plate = new Plate(),
      html = get(name, 'html');

  plate.html(html).data(data);

  if (method === 'bind') {
    return plate.bind(map);
  } else if (method === 'compile') {
    return plate.compile(map)(data);
  }
};

common.createTest = function(name, map) {
  return {
    topic: function() {
      this.out = get(name, 'out');
      this.data = JSON.parse(get(name, 'json') || "{}");

      return {
        render: common.render(name, this.data, map, 'bind'),
        compile: common.render(name, this.data, map, 'compile')
      };
    },
    'should merge data to markup': function(result) {
      assert.equal(result.render, this.out);
      assert.equal(result.compile, this.out);
    }
  };
};
