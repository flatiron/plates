
;var Plates = function Plates(undefined) {
  
  var Merge = function Merge() {};

  Merge.prototype = {

    tag: new RegExp(
      [
        '(<',
        '(/?)', // 2 - is closing
        '([-:\\w]+)', // 3 - name
        '((?:\\s+[-\\w]+(?:', '=', '(?:' +
          '\\w+|' +
          '"[^"]*"|' +
          '\'[^\']*\'))?)*)', // 4 - attributes
        '(/?)', // 5 - is self-closing
        '>)(.*)'
      ].join('\\s*')
    ),

    attr: /([-\w]*)=(?:["\']([-\.\w\s]*)["\'])/gi,

    hasClass: function(str, className) {
      return str.indexOf(className) > -1;
    },

    bind: function bind(html, data, map) {

      data = data || {};

      if (map) {
        map = map.mappings; 
      }

      var that = this;
      var str = html;
      var buffer = '';

      var matchmode = false;
      var openers = 0;

      var right = 0, left = 0;
      var match, tag, text;

      do {

        tag = '', text = '';
        left = right;
        match = this.tag.exec(str); // test
        str = match && match[6]; // next

        if (match) {

          right += match.index + match[1].length;

          //
          // get the prior text to the left of the tag that was found.
          // if it is a self closing tag, it will never have text.
          //

          if (matchmode) {

            //
            // and its a closing.
            //
            if (!!match[2]) {
              if(openers <= 0) {
                matchmode = false;
              }
              else {
                --openers;
              }
            }
            //
            // and its not a closing tag!
            //
            else if (!match[5]) {
              ++openers;
            }

          }
          else if (!match[5]) {

            text = html.slice(left, right - match[1].length);
          }

          //
          // get the next tag from the stream.
          //
          tag = html.slice(left + match.index, right);

          //
          // if there is a map, we may want to replace the value
          // in an attribute or replace the body of the tag based
          // on a specified attribute value. Closing tags are ignored.
          //
          if (map && !match[2]) {

            for (var i = map.length - 1; i >= 0; i--) {

              tag = tag.replace(
                this.attr,
                function (attr, key, value, idx) {

                  console.log(key, !map[i].replace, map[i].attribute === key, map[i].value, value)

                  if (map[i].replace === key) {

                    //
                    // if there is data intended to replace the attribute, use that
                    // otherwise look at the data structure and try to use that.
                    //
                    var newdata = map[i].dataKey ? data[map[i].dataKey] : data[key];
                    return key + '="' + (newdata || '') + '"';
                  }
                  else if (!map[i].replace && map[i].attribute === key && map[i].value === value) {
                    
                    buffer += text + tag + data[map[i].dataKey];
                    matchmode = true;
                    return attr;
                  }
                  else {

                    return attr;
                  }
                }
              );

              console.log(tag);
            }
          } 
          else if (!match[5]) { // cant be self closing to have text in the body.

            //
            // if there is no map, we are just looking to match
            // the specified id to a data key in the data object.
            //
            tag.replace(
              this.attr,
              function (attr, key, value, idx) {
                if (key === 'id' && data[value]) {
                  buffer += text + tag + data[value];
                  matchmode = true;
                }
              }
            );
          }

          if (!matchmode) {

            buffer += (text || '') + (tag || '');
          }
        }
      }
      while (str);

      //
      // write anything that is leftover, as it will
      // be arbitrary bites leftover from the stream.
      //
      if (html) {
        buffer += html.slice(right);
      }

      return buffer;

    }
  };

  var Mapper = function Mapper(val) {
    if (!(this instanceof Mapper)) { return new Mapper(val); }
    this.mappings = [];
  };

  function last(newitem) {
    if (newitem) {
      this.mappings.push({});
    }
    return this.mappings[this.mappings.length-1];
  }

  Mapper.prototype = {
    use: function(val) {
      last.call(this).dataKey = val;
      return this;
    },
    where: function(val) {
      last.call(this, true).attribute = val;
      return this;
    },
    is: function(val) {
      last.call(this).value = val;
      return this;
    },
    as: function(val) {
      last.call(this).replace = val;
      return this;
    }
  };

  var host = (typeof process !== 'undefined' && process.title === 'node' ? exports : Plates);

  host.bind = function (html, data, map) {
    var merge = new Merge();
    return merge.bind(html, data, map);
  };

  host.Map = Mapper;

  return host;

}();
