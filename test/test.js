var assert = require('assert'),
    events = require('events'),
    path = require('path'),
    sys = require('sys'),
    vows = require('vows'),
    Plate = require('../lib/plates');

vows.describe('merge data into markup')
	.addBatch({
	  'when creating a new constructor and providing both data and markup': {
	    topic: function () { 

	    	this.htmlString = '<div id="test"></div>';
	    	this.dataObject = { "test": "Hello, World." };

	    	return this.output = new Plate(this.htmlString, this.dataObject);
	  	},
	    'the data is merged into the markup.': function (topic) {
	        assert.equal (topic.html(), '<div id="test">Hello, World.</div>');
	    }
	  }
	})
	//
	// TODO: Add more tests.
	//
	.export(module);
