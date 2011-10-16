
;(function(exports) {

  var stack = [], handler = {};
  var lastrest, lasttag;

  //
  // create a map from a space seperated 
  //
  function map(str){
    var obj = {}, items = str.split(/\s+/);
    for (var i = 0; i < items.length; i++) {
      obj[ items[i] ] = true;
    }
    return obj;
  }

  //
  // Regular Expressions for parsing tags and attributes
  //
  var START_TAG = /^<([-A-Za-z0-9_]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    END_TAG = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
    ATTR = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

  //
  // Generate a container of maps that contain each tag name for fast access.
  //
  var MAPS = {
    //
    // Empty Elements
    //
    empty: map(
      'area base basefont br col frame hr img input isindex link meta param embed'
    ),
    //
    // Block Elements
    //
    block: map(
      'address applet aside blockquote button center command datagrid dd del details dialog ' +
      'dir div dl dt fieldset figcaption figure footer form frameset header hr iframe ins isindex' + 
      'li map menu noframes noscript object ol p pre script table tbody td tfoot th thead tr ul'
    ),
    //
    // Inline Elements - HTML 4.01
    //
    inline: map(
      'a abbr acronym applet b basefont bdo big br button cite code del dfn em font i ' +
      'iframe img input ins kbd label map mark meter object progress q s samp script select ' +
      'small span strike strong sub sup textarea time tt u var'
    ),
    //
    // Elements that you can, intentionally, leave open
    // (and which close themselves)
    //
    closeSelf: map(
      'colgroup dd dt li options p td tfoot th thead tr'
    ),
    //
    // Attributes that have their values filled in disabled="disabled"
    //
    fillAttrs: map(
      'audio checked compact declare defer disabled ismap multiple nohref noresize noshade ' +
      'nowrap readonly selected video'
    ),
    //
    // Special Elements (can contain anything)
    //
    special: map(
      'script style'
    )
  };

  //
  // ### parseAttrs(rest, attrs)
  // #### @rest {String} a string representing the offset of the replacement result
  // #### @attrs {Array} a reference to an array that will contain the new object literal of values
  // Transform the result of the replace into an object literal
  //
  function parseAttrs(rest, attrs) {
    return rest.replace(ATTR, function(match, name) {
      var value = arguments[2] ? arguments[2] :
        arguments[3] ? arguments[3] :
        arguments[4] ? arguments[4] :
        MAPS.fillAttrs[name] ? name : '';

      attrs.push({
        name: name,
        value: name === 'class' ? value.split(/\s+/) : value,
        escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
      });
    });
  }

  //
  // ### parseStartTag(tag, tagName, rest, unary)
  // #### @tag {String} the entire tag
  // #### @tagName {String} the tagname after evaluating the entire tag
  // #### @rest {String} a string representing the offset of the replacement result
  // #### @unary {Bool} denotes if the tag has content and closing
  // Builds a meta information object literal about the tag that is parsed.
  //
  function parseStartTag(tag, tagName, rest, unary) {

    if (MAPS.block[tagName]) {
      while (stack.last() && MAPS.inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }

    if (MAPS.closeSelf[tagName] && stack.last() === tagName) {
      parseEndTag('', tagName);
    }

    unary = MAPS.empty[tagName] || !!unary;

    if (!unary)
      stack.push(tagName);

    if (handler.start) {
      
      var attrs = [];
      parseAttrs(rest, attrs);
      handler.start(tagName, attrs, unary);
    }
  }

  //
  // ### parseEndTag(tag, tagName)
  // #### @tag {String} the entire tag
  // #### @tagName {String} the tagname after evaluating the entire tag
  // Builds a meta information object literal about the tag that is parsed.
  //
  function parseEndTag(tag, tagName) {
    
    // If no tag name is provided, clean shop
    var pos;

    if (!tagName) {
      pos = 0;
    }  

    // Find the closest opened tag of the same type
    else {
      for (var pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] === tagName) {
          break;
        }
      }
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (handler.end) {
          handler.end(stack[i]);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }

  //
  // ### parser(html, handler)
  // #### @html {String} a string literal containing markup that will be parsed.
  // #### @conf {Object} an object literal that contains methods used throughout parsing the html string.
  // The parser function take a string of markup and a configuration object, as it parses the string
  // and finds meaningful or interesting tokens, it calls the relevent functions from the configuration object.
  //
  function parser(html, conf) {

    var index, chars, buffer, match, last = html;

    stack = [];
    handler = conf;

    //
    // get the last item in the array.
    //
    stack.last = function() {
      return this[this.length - 1];
    };

    //
    // iterate through the html as a string and examine it charcater
    // by character. It will be reduced as tags are discovered and the
    // coresponding handler methods are called.
    //
    while (html) {
      chars = true;
      //
      // Make sure we're not in a script or style element
      //
      if (!stack.last() || !MAPS.special[stack.last()]) {

        //
        // Comment
        //
        if (html.indexOf('<!--') === 0) {
          index = html.indexOf('-->');

          if (index >= 0) {
            if (handler.comment)
              handler.comment(html.substring(4, index));
            html = html.substring(index + 3);
            chars = false;
          }
        //
        // end tag
        //
        } 
        else if (html.indexOf('</') === 0) {
          match = html.match(END_TAG);

          if (match) {
            html = html.substring(match[0].length);
            match[0].replace(END_TAG, parseEndTag);
            chars = false;
          }
        //
        // start tag
        //
        } 
        else if (html.indexOf('<') === 0) {
          match = html.match(START_TAG);
          if (match) {
            html = html.substring(match[0].length);
            match[0].replace(START_TAG, parseStartTag);
            chars = false;
          }
        }
        //
        // tag content
        //
        if (chars) {
          index = html.indexOf('<');

          var text = index < 0 ? html : html.substring(0, index);
          html = index < 0 ? '' : html.substring(index);

          if (handler.chars) {
            var attrs = [];
            handler.chars(text);
          }
        }
      //
      // we are inside a script or style element, wrap the content and put
      // it back where we found it.
      //
      } 
      else {
        var lasttag = new RegExp('(.*)<\/' + stack.last() + '[^>]*>');
        html = html.replace(lasttag, function(all, text) {
          text = text.replace(/<!--(.*?)-->/g, "$1")
            .replace(/<!\[CDATA\[(.*?)]]>/g, "$1");

          if (handler.chars)
            var attrs = [];
            handler.chars(text);

          return '';
        });

        parseEndTag('', stack.last());
      }

      if (html === last)
        throw 'Parse Error: ' + html;
      last = html;

    }

    //
    // Clean up any remaining tags
    //
    parseEndTag();
  };

  function builder(str, data) {

    var that = this;
    var buffer = '';

    parser(str, {
      match: false,
      start: function(tag, attrs, unary) {

        buffer += '<' + tag;

        for (var i = 0; i < attrs.length; i++)
          buffer += ' ' + attrs[i].name + '="' + attrs[i].escaped + '"';

        buffer += (unary ? '/' : '') + '>';

        this.match = false;

        //
        // Attempt to match on attributes
        //
        if (attrs) {
          var i=0, j=0, al=attrs.length, classNamesLen, val;

          //
          // if there is an array of attributes.
          //
          for (; i<al; i++) {

            //
            // attempt to match on `data-bind`
            //
            if (attrs[i].name === 'data-bind') {
              return buffer += data[attrs[i].value];
            }

            //
            // if the attribute is a `class`.
            //
            else if (attrs[i].name === 'class') {

              //
              // iterate over the class names in the class.
              //
              for (j = 0, classNamesLen=attrs[i].value.length; j < classNamesLen; j++) {

                //
                // if there is a match.
                //
                val = data[attrs[i].value[j]];

                if(typeof val === 'string') {
                  this.match = true;
                  return buffer += data[attrs[i].value[j]];
                }
              }
            }
          }
        }
      },
      end: function(tag) {
        buffer += '</' + tag + '>';
      },
      chars: function(text) {
        //
        // if there is a match, dont use the existing content of the 
        // tag, it has already been added to the buffer.
        //
        if(this.match) {
          return buffer;
        }
        return buffer += text;
      },
      comment: function(text) {
        buffer += '<!--' + text + '-->';
      }
    });

    return buffer;

  }

  //
  // ### Plates(html, data)
  // #### @html {String} The string of raw html to be parsed.
  // #### @data {Object | Array} The data to merge with the raw html.
  // Plates is a simple unobtrusive templating engine based on persers by Eric Ardvison 
  // and John Resig. Its primary purpose is to parse markup and interject data based 
  // on its attributes, ids or tagnames. The ctor takes an html string, and an object
  // literal.
  //
  function Plates(html, data) {
    this.output = builder(html, data);
  };

  //
  // ### configure(conf)
  // #### @conf {Object} an object literal that contains configuration settings.
  // Instance configuration.
  //
  Plates.prototype.configure = function(conf) {
    return this;
  };

  //
  // ### html()
  // Gets the html that is produced as a result of the data and the html string being merged.
  //
  Plates.prototype.html = function() {
    return this.output;
  };

  if(typeof process !== 'undefined' && process.title === 'node') {
    module.exports = Plates
  }
  else {
    window.Plates = Plates;
  }

})();
