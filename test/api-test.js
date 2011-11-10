var vows = require('vows'),
    assert = require('assert'),
    common = require('./fixtures/common');

vows.describe('merge data into markup').addBatch({
  'when creating a new constructor and providing both data and markup': {
    'for simple template': common.createTest('simple')
  }
}).export(module);
