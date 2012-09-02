var vows = require('vows'),
    assert = require('assert'),
    Plates = require('../lib/plates');
    common = require('./common');



function matchClosing(input, tagname, html) {
  var closeTag = '</' + tagname + '>',
      openTag  = new RegExp('< *' + tagname + '( *|>)', 'g'),
      closeCount = 0,
      openCount = -1,
      from, to, chunk
      ;
  
  from = html.search(input);
  to = from;

  while(to > -1 && closeCount !== openCount) {
    to = html.indexOf(closeTag, to);
    if (to > -1) {
      to += tagname.length + 3;
      closeCount ++;
      chunk = html.slice(from, to);
      openCount = chunk.match(openTag).length;
    }
  }
  if (to === -1) {
    throw new Error('Unmatched tag ' + tagname + ' in ' + html)
  }

  return chunk;
}

// Tests

assert.equal(matchClosing('<div class="abc">', 'div', '<div class="abc"></div>'), '<div class="abc"></div>');

assert.equal(matchClosing('<div class="abc">', 'div', '<div class="abc"></div><div class="def"></div>'), '<div class="abc"></div>');

assert.equal(matchClosing('<div class="abc">', 'div', '<div><div class="abc"></div></div>'), '<div class="abc"></div>');

assert.equal(matchClosing('<div class="abc">', 'div', '<div><div class="abc"><li></li><li></li></div></div>'), '<div class="abc"><li></li><li></li></div>');

assert.equal(matchClosing('<li class="name">', 'li', '<li><ul><li class="name"><span abc></span></li></ul></li>'), '<li class="name"><span abc></span></li>');

assert.throws(function() {
  matchClosing('<div class="abc">', 'div', '<div class="abc"></li>');
}, 'Unmatched tag div in <div class="abc"></li>');

assert.equal(matchClosing('<li class="organizations">', 'li',
'<ul>\
  <li class="organizations">\
    <h3 class="name"></h3>\
    <ul>\
      <li class="staff">\
        <table>\
          <tr class="name">\
            <td class="first"></td>\
            <td class="last"></td>\
          </tr>\
        </table>\
      </li>\
    </ul>\
  </li>\
</ul>'),
'<li class="organizations">\
    <h3 class="name"></h3>\
    <ul>\
      <li class="staff">\
        <table>\
          <tr class="name">\
            <td class="first"></td>\
            <td class="last"></td>\
          </tr>\
        </table>\
      </li>\
    </ul>\
  </li>');
