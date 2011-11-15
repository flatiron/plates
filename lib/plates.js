var Plates = function main(undefined) {
  
  var Merge = function Merge() {};

  Merge.prototype = {

    tag: new RegExp(
      [
        '\\s*',
        '<',
        '(/?)', // 1 - is closing
        '([-:\\w]+)', // 2 - name
        '((?:\\s+[-\\w]+(?:', '=', '(?:' +
          '\\w+|' +
          '"[^"]*"|' +
          '\'[^\']*\'))?)*)', // 3 - attributes
        '(/?)', // 4 - is self-closing
        '>'
      ].join('\\s*'),
      'gi'
    ),

    attr: new RegExp(
      '([-\\w]+)=(?:["\']([-\\w\\s]+)["\'])', // '([-\\w]+)=(?:([-\\w]+)|["\']([-\\w\\s]+)["\'])'
      'gi'
    ),

    bind: function bind(html, data, map) {

      while (matchedTag = this.tag.exec(html)) {
        
        //
        // not a closing tag, and has attributes
        //
        if (matchedTag[1] !== '/' && matchedTag[3] !== '') {
          if (!map) {
            
            while (matchedAttr = this.attr.exec(matchedTag[3])) {

              //
              // has an attribute who's value is a match.
              //
              if (matchedAttr[1] === 'id' && data[matchedAttr[2]]) {
                var idx = matchedTag.index + matchedTag[0].length;
                html = html.slice(0, idx) + data[matchedAttr[2]] + html.slice(idx);
              }
            }


          }
          else {

            //
            // if there is a map, the user wants an explicit 
            // data-key to tag-attribute match.
            //
            for (var key in map) {
              if (data[key]) {
                while (matchedAttr = this.attr.exec(matchedTag[3])) {

                  //
                  // has an attribute who's value is a match.
                  //
                  if (matchedAttr[1] === map[key] && data[matchedAttr[2]]) {
                    var idx = matchedTag.index + matchedTag[0].length;
                    html = html.slice(0, idx) + data[matchedAttr[2]] + html.slice(idx);
                  }
                }
              }
            }

          
          }
        }
      }

      return html;
    }
  };

  return ({
    name: "plates.js",
    version: "0.2.1",

    bind: function(html, data, map) {
      var merge = new Merge();
      return merge.bind(html, data, map);
    }
  });

}();

exports.name = Plates.name;
exports.version = Plates.version;

exports.bind = function() {
  return Plates.bind.apply(this, arguments);
};
