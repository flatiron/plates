var vows = require('vows'),
    assert = require('assert'),
    common = require('./fixtures/common');

vows.describe('merge data into markup').addBatch({
  'when providing both data and markup': {
    'for simple template': common.createTest('simple'),
    'for one level template': common.createTest('one-level'),
    'for a data-bound template': common.createTest('data-bind', { "name": "data-bind" }),
    'for a different target attribute': common.createTest('attribute', { "url": ["data-bind", "src"]}),
    'for an different target attribute with extra values': common.createTest('extra-attribute', { "url": ["class", "src"]})
 }
}).export(module);
