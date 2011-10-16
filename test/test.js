var assert = require('assert'),
    events = require('events'),
    path = require('path'),
    sys = require('sys'),
    vows = require('vows'),
    Plate = require('../lib/plates');

vows.describe('Division by Zero').addBatch({
  'when creating a new constructor and providing both data and markup': {
    topic: function () { 

    	var html = this.html = '<div id="test"></div>';
    	var data = this.data = { "test": "Hello, World." };

    	return this.output = new Plate(html, data);
  	},

    'the data is merged into the markup.': function (topic) {
        assert.equal (topic, '<div id="test">Hello, World.</div>');
    }
  }
}).export(module);