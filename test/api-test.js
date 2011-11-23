var vows = require('vows'),
    assert = require('assert'),
    common = require('./fixtures/common');

vows.describe('merge data into markup').addBatch({
  'when providing both data and markup': {
    'for simple template': common.createTest('simple'),
    'for one level template': common.createTest('one-level'),
  }
}).export(module);
