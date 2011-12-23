;var Plates = function main(undefined) {
  
  var Merge = function Merge() {};

  Merge.prototype = {

    tag: new RegExp(
      [
        '(<',
        '(/?)', // 1 - is closing
        '([-:\\w]+)', // 2 - name
        '((?:\\s+[-\\w]+(?:', '=', '(?:' +
          '\\w+|' +
          '"[^"]*"|' +
          '\'[^\']*\'))?)*)', // 3 - attributes
        '(/?)', // 4 - is self-closing
        '>)(.*)'
      ].join('\\s*')
    ),

    attr: new RegExp(
      '([-\\w]*)=(?:["\']([-\.\\w\\s]*)["\'])',
      'gi'
    ),

    hasClass: function(str, className) {
      return str.indexOf(className) > -1;
    },

    bind: function bind(html, data, map) {

      var that = this;
      var out = '';
      var pos = 0;
      var openers = 0;
      var updates = '';
      var insertion = null;
      var matchmode = false;
      var insert = true;

      if (map) {
        map = map.mappings; 
      }

      while (html) {
        html.replace(that.tag, function (body, match, closing, tag, attributes, selfclosing, remainder, index) {

          //
          // search for the next tag, so we know
          // where and how to slice and dice the html.
          //
          var next = remainder.search(that.tag);

          //
          // its a closing tag
          //
          if (matchmode) {
            if (!!closing) {
              if(openers === 0) {
                insert = true;
                matchmode = false;
              }
              else {
                --openers;
              }
            }
            //
            // its not a closing tag!
            //
            else {
              ++openers;
              insert = false;
            }
          }

          //
          // we're at the end of the line.
          //
          if (next === -1) {
            out += match + remainder;
            html = null;
          }
          //
          // we have a section, let's copy it over to
          // the output buffer and then disgard the rest.
          //
          else {

            pos = next + (index + match.length);

            //
            // find out if there is a match with either the map
            // or the data that was provided to the bind method.
            //
            !matchmode && match.replace(that.attr, function (attr, key, value, idx) {

              if (map) {

                //
                // look at all of the items in the map and try to apply
                // the mappings for all of the values that have been spec'd.
                //
                for (var i = map.length - 1; i >= 0; i--) {

                  if (map[i].replace === key && data[map[i].dataKey]) {
                    insertion = {
                      start: idx,
                      end: attr.length
                    };
                    updates = data[map[i].dataKey];
                  }

                  //
                  // find out if this tag is the target by looking at an
                  // arbitrary attribute that the user has provided.
                  //
                  if (map[i].attribute === key && map[i].value === value) {
                    updates = data[map[i].dataKey];
                    matchmode = true;
                  }
                }
              }
              else {

                //
                // find out if this tag is the target by checking the data
                // object and looking for this attribute value as an object key.
                //
                if (key === 'id' && data[value]) {
                  updates = data[value];
                  matchmode = true;
                }
              }
            });

            //
            // should we write data?
            //
            if (updates) {

              //
              // position the new content
              //
              if (insertion) {

                //
                // in some cases the content goes inside the tag.
                //
                var start = ~(index + insertion.start + insertion.end + 1);
                var value = html.slice(0, start);
                value += updates + '"';
                value += html.slice(insertion.start + insertion.end);
                out += value;

                insertion = null;
                updates = null;
              }
              else {
                //
                // in other cases, it goes inside the tag body.
                //
                out += html.slice(0, index + match.length) + updates;
                updates = null;                
              }
            }
            else if (insert) {
              //
              // if there are no updates and we are not in the middle of a
              // match, just grab the next slice and add it to our buffer.
              //
              out += html.slice(0, pos);
            }
          
            //
            // reduce the initial html from existence.
            //
            html = html.substr(pos);

          }
        });
      }

      return out;
    }
  };

  var Mapper = function Mapper(val) {
    if (!(this instanceof Mapper)) { return new Mapper(val); }
    this.mappings = [];
  };

  //
  // almost, but not quite...
  //
  function last() {
    if (this.mappings.length < 1) {
      return this.mappings.push({});
    }
    else {
      return this.mappings[this.mappings.length-1];
    }
  }

  Mapper.prototype = {
    use: function(val) {
      last.call(this).dataKey = val;
      return this;   
    },
    is: function(val) {
      last.call(this).value = val;
      return this;
    },
    where: function(val) {

      if (typeof val === 'string') {

        this.mappings.push({
          "attribute": val,
          "replace": null
        });
      }
      else {
        //
        // TODO: Accept an object literal of attribute `ids` 
        // to data `keys`. Lets iterate each one and build
        // up the mappings hash. By default, matches will be
        // made on a tag's IDs.
        //
      }
      return this;
    },
    as: function(val) {
      last.call(this).replace = val;
      return this;
    }
  };

  return ({
    bind: function (html, data, map) {
      var merge = new Merge();
      return merge.bind(html, data, map);
    },
    Map: Mapper
  });
}();

if (typeof module !== 'undefined') {
  exports.bind = function() {
    return Plates.bind.apply(this, arguments);
  };
  exports.Map = function() {
    return Paltes.Map.apply(this, arguments);
  };
}
