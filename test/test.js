var assert = require('assert'),
    events = require('events'),
    path = require('path'),
    sys = require('sys'),
    vows = require('vows'),
    Plate = require('../lib/plates');

vows.describe('Merge an object literal with one level of depth into a single tag', {
  'When creating an instance, and saving it': {
  	topic: function () {

      var plate = this.plate = new Plates;
      var html = this.html = '<div id="test"></div>';
      var data = this.data = { "test": "Hello, World." };

      this.output = plate(html, data);
    },
    'it should return the previous instance': function (res) {
	  assert.strictEqual(this.html, '<div id="test">Hello, World</div>');
    }
  }
});