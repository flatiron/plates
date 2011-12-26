
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

    attr: /([-\w]*)=(?:["\']([-\.\w\s]*)["\'])/gi,

    hasClass: function(str, className) {
      return str.indexOf(className) > -1;
    },

    bind: function bind(html, data, map) {

      var that = this,
          out = '',
          pos = 0,
          openers = 0,
          updates = [],
          matchmode = false,
          createmode = false,
          insert = true;

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
            else if (!selfclosing) {
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
                // if the map specifies a replacement to be made,
                // but there is no matching key found in the attributes
                // of the tag, we should create the attribute and then
                // popuate it.
                //
                createmode = false;

                //
                // look at all of the items in the map and try to apply
                // the mappings for all of the values that have been spec'd.
                //

                for (var i = map.length - 1; i >= 0; i--) {

                  //
                  // There may be an exact match for the key
                  // that the map wants to replace.
                  //
                  if (map[i].replace === key && data[map[i].dataKey]) {
                    updates.push({
                      data: data[map[i].dataKey],
                      insertion: {
                        start: idx,
                        end: attr.length
                      }
                    });
                    continue;
                  }

                  //
                  // find out if this tag is the target by looking at an
                  // arbitrary attribute that the user has provided.
                  //
                  if (map[i].attribute === key && !map[i].replace &&
                    (map[i].value === value || key === 'class' && that.hasClass(value))) {
                    updates.push({ data: data[map[i].dataKey] });
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
                  updates.push({ data: data[value] });
                  matchmode = true;
                }
              }
            });

            //
            // should we write data?
            //
            if (updates.length > 0) {

              //
              // there may be multiple updates from the map
              //

              var update = null;
              while(update = updates.pop()) {

                //
                // position the new content
                //

                if (update.insertion) {

                  //
                  // in some cases the content goes inside the tag.
                  //
                  var i = update.insertion;
                  var start = ~(index + i.start + i.end + 1);
                  var value = html.slice(0, start);

                  value += update.data + '"';
                  value += html.slice(i.start + i.end);
                  out += value;
                }
                else {
                  //
                  // in other cases, it goes inside the tag body.
                  //
                  out += html.slice(0, index + match.length) + update.data;
                }
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
