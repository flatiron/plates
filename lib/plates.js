;var Plates = (typeof process !== 'undefined' && typeof process.title !== 'undefined') ? exports : {};

!function(exports) {

  function isArray(o) {
    return ~({}).toString.call(o).indexOf('Array');
  }

  function isObject(o) {
    return ~({}).toString.call(o).indexOf('Object');
  }

  var Merge = function Merge() {};
  
  Merge.prototype = {

    tag: new RegExp([
      '<',
      '(/?)', // 2 - is closing
      '([-:\\w]+)', // 3 - name
      '((?:[-\\w]+(?:', '=', 
      '(?:\\w+|["|\'](?:.*)["|\']))?)*)', // 4 - attributes
      '(/?)', // 5 - is self-closing
      '>'
    ].join('\\s*')),

    attr: /([\-\w]*)=(?:["\']([\-\.\w\s\/]*)["\'])/gi,

    hasClass: function(str, className) {
      return str.indexOf(className) > -1;
    },

    iterate: function(html, value, components, tagname) {

      var output      = '',
          segment     = html.slice(
              html.search(components.input),
              html.lastIndexOf(tagname) + tagname.length + 1
          );

      // Is it an array?
      if (isArray(value)) {
          
        // Yes: set the output to the result of iterating through the array
        for (var i = value.length; i--;) {
          output += this.bind(segment, value[i]);
        } 
        
        // TODO : Figure out why Plates is appending closing tags when 
        // not required
        output = output.slice(0, -(tagname.length + 3));

      }

      // Is it an object?
      else if (isObject(value)) {

        // We need to refine the selection now that we know we're dealing with
        // nested objects
        segment = segment.slice(components.input.length, -(tagname.length + 3));
        output += this.bind(segment, value);

      }    
      
      // Otherwise, this is a simple value
      else {
        output = value;
      }

      return output;

    },
    

    bind: function bind(html, data, map) {
      
      // Iterate through arrays
      if (isArray(data)) {
        
        var output = '';
        
        for (var i = 0, l = data.length; i < l; i++) {
          output += this.bind(html, data[i], map);
        }

        return output;
      }

      html = html || '';
      data = data || {};

      var that = this;

      var openers = 0,
          components,
          attributes,
          mappings = map && map.mappings,
          intag = false,
          tagname = '',
          isClosing = false,
          isSelfClosing = false,
          matchmode = false,
          createAttribute = map && map.conf && map.conf.create,
          closing, 
          tagbody;

      var c, 
          buffer = '',
          left;
      
      for (var i = 0, l = html.length; i < l; i++) {

        c = html[i];
        
        if (c === '!' && intag && !matchmode) {
          intag = false;
          buffer += html.slice(left, i+1);
        }
        else if (c === '<' && !intag) {
          closing = true;
          intag = true;
          left = i;
        }
        else if (c === '>' && intag) {

          intag = false;
          tagbody = html.slice(left, i+1);
          
          components = this.tag.exec(tagbody);

          if(!components) { continue; }

          isClosing = components[1];
          tagname = components[2];
          attributes = components[3];
          isSelfClosing = components[4];

          if (matchmode) {

            //
            // and its a closing.
            //
            if (!!isClosing) {

              if (openers <= 0) {
                matchmode = false;
              }
              else {
                --openers;
              }
            }
            //
            // and its not a self-closing tag
            //
            else if (!isSelfClosing) {
              ++openers;
            }
          }

          if (attributes && !isClosing && !matchmode) {

            //
            // if there is a match in progress and 
            //
            if (mappings && mappings.length > 0) {

              for (var ii = mappings.length - 1; ii >= 0; ii--) {

                var setAttribute = false, 
                    shouldSetAttribute = mappings[ii].re && attributes.match(mappings[ii].re);
                
                tagbody = tagbody.replace(this.attr, function(str, key, value, a) {
                  
                  // Does a data key exist, is it a function?
                  var newdata = mappings[ii].dataKey ? typeof mappings[ii].dataKey === 'function' ? mappings[ii].dataKey(data) : data[mappings[ii].dataKey] : data[key];

                  if (shouldSetAttribute && mappings[ii].replace !== key) {
                    return str;
                  }

                  else if (shouldSetAttribute) {
                    setAttribute = true;
                    return key + '="' + (newdata || '') + '"';
                  }

                  else if (!mappings[ii].replace && mappings[ii].attribute === key) {

                    if (mappings[ii].value === value || that.hasClass(value, mappings[ii].value || mappings.conf.where === key)) {
                        
                      // Now we use the new method of determining the data
                      newdata = that.iterate(html, newdata, components, tagname);

                      buffer += (isArray(data[mappings[ii].dataKey])) ? newdata : tagbody + (newdata || '');

                      matchmode = true;

                    }
                  }

                  return str;

                });

                if (createAttribute && shouldSetAttribute && !setAttribute) {

                  var spliced = isSelfClosing? 2 : 1,
                      close = isSelfClosing? '/>': '>';
                    
                  left = tagbody.substr(0, tagbody.length - spliced);

                  if (left[left.length - 1] == ' ') {

                    left = left.substr(0, left.length - 1);
                      
                    if (isSelfClosing) {
                      close = ' ' + close;
                    }
 
                  } 

                  tagbody = [
                    left,
                    ' ',
                    mappings[ii].replace,
                    '="',
                    data[mappings[ii].dataKey], 
                    '"',
                    close
                  ].join('');
                }
              }
            }
            else {

              //
              // if there is no map, we are just looking to match
              // the specified id to a data key in the data object.
              //
              tagbody.replace(this.attr, function (attr, key, value, idx) {

                if (key === map && map.conf.where || 'id' && data[value]) {

                  var output = that.iterate(html, data[value], components, tagname);

                  buffer += isArray(data[value]) ? output : tagbody + output;
                  matchmode = true;
                } 

              });
            }
          }

          //
          // if there is currently no match in progress
          // just write the tagbody to the buffer.
          //
          if (!matchmode) {
            buffer += tagbody;
          }

        }
        else if (!intag && !matchmode) {

          //
          // currently not inside a tag and there is no
          // match in progress, we can write the char to
          // the buffer.
          //
          buffer += c;
        }

      }

      return buffer;

    }

  };

  var Mapper = function Mapper(conf) {
    if (!(this instanceof Mapper)) { return new Mapper(conf); }
    this.mappings = [];
    this.conf = conf || {};
  };

  function last(newitem) {
    if (newitem) {
      this.mappings.push({});
    }
    var m = this.mappings[this.mappings.length-1];
    if (m.attribute && m.value && m.dataKey && m.replace) {
      m.re = new RegExp(m.attribute + '=([\'"]?)' + m.value + '\\1');
    } else {
      delete m.re;
    }

    return m;
  }

  Mapper.prototype = {
    use: function(val) {
      last.call(this).dataKey = val;
      return last.call(this) && this;
    },
    to: function(val) {
      return this.use(val);
    },
    where: function(val) {
      last.call(this, true).attribute = val;
      return last.call(this) && this;
    },
    class: function(val) {
      return this.where('class').is(val);
    },
    is: function(val) {
      last.call(this).value = val;
      return last.call(this) && this;
    },
    insert: function(val) {
      var l = last.call(this);
      l.replace = l.attribute;
      l.dataKey = val;

      return last.call(this) && this;
    },
    as: function(val) {
      last.call(this).replace = val;
      return last.call(this) && this;
    }
  };

  // where('class').is('foo').insert('bla')

  exports.bind = function (html, data, map) {
    var merge = new Merge();
    return merge.bind(html, data, map);
  };

  exports.Map = Mapper;

}(Plates);

