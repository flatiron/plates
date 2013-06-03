"use strict";

var Plates = module && module.exports && exports || {};

(function (exports, env) {

  var global = this || {};

  //
  // ### defineProperties(props)
  // #### @props {Object} property list
  //
  // Dynamically assign properties to be hidden.
  // Methods and values are not overwriteable by default.
  //
  global.define = function (props) {
    var self = this || {};

    Object.keys(props).forEach(function (key) {
      var obj = {
        configurable: false
      };

      if (typeof props[key] === 'object' && !Array.isArray(props[key]) &&
          props[key].value && (props[key].configurable || props[key].writeable)) {
          obj = global.mixin(false, obj, props[key]);
      }
      else obj = global.mixin(false, obj, {
        value: props[key]
      });

      Object.defineProperty(self, key, obj);
    });

    return self;
  };


  //
  // ### global.args
  // #### @args {Object|Array} argument list from a function
  //
  global.args = function (args) {
    var args = [].slice.call(args, 0),
        callback = typeof [].concat(args).pop() === 'function' && args.pop() || undefined;

    Object.defineProperties(args, {
      "callback": {
        value: callback
      },
      "cb": {
        value: callback
      },
      "first": {
        value: [].concat(args).shift()
      },
      "last": {
        value: [].concat(args).pop()
      }
    });

    return args;
  };


  //
  // ### global.mixin(object[, object[, ...]][, combine][, callback])
  // #### @object {Object} object containing keys to combine
  // #### @combine {Boolean} whether to combine keys into an array if there is
  //      more than one
  // #### @callback {Function} called once the mixin is complete
  //
  // All objects will be combined unless combine is set to false somewhere in
  // the callback list. Combine can be used multiple times, but only one
  // callback is allowed.
  //
  global.mixin = function (/*obj[, obj[, obj[,...]]][, combine][, callback]*/) {
    var args = global.args(arguments),
        obj = {},
        combine = true;

    args.forEach(function (arg) {
      if (typeof arg === 'boolean') combine = arg;
      if (typeof arg !== 'object' || Array.isArray(arg)) return;
      Object.keys(arg).forEach(function (key) {
        if (combine) {
          if (obj[key] && !Array.isArray(obj[key]))
            return obj[key] = [obj[key]];
          
          if (obj[key] && Array.isArray(obj[key]))
            return obj[key].push(arg[key]);
        }
        return obj[key] = arg[key];
      });
    });

    return args.callback ? callback(null, obj) : obj;
  };


  exports.bind = function (/*html, data, map, callback*/) {
    var args = global.args(arguments),
        html = [],
        data = {},
        collections = [],
        maps = [],
        self = this;

    args.forEach(function (arg) {
      if (typeof arg === 'string')
        html.push(arg);

      if (typeof arg === 'object') {
        if (!Array.isArray(arg))
          data = global.mixin(data, arg);
        else
          collections.push(arg);
      }

      if (arg instanceof Map)
        maps.push(arg);
    });

    html = Plates.matchTags(html);

    return args.callback ? args.callback(null, html) : html;
  };


  //
  // ### Plates.matchTags(html)
  // #### @parsed {Array|String} array or string of html to parse.
  //
  exports.matchTags = function (html) {
    var self = this,
        parser = Parser(),
        html, chunk, depth =0;

    // Parse all the things
    if (Array.isArray(html)) {
      return html.map(function (html) {
        return self.matchTags(html);
      });
    }
    else html = parser.parse(html);

    for (var i = 0; i < html.length; i++) {
      var chunk = html[i];

      if (typeof chunk !== 'object' || Array.isArray(chunk)) continue;

      // Doctype
      if (chunk.prefix === '!') continue;

      // We don't want to pick up closing tags here.
      if (chunk.prefix === '/') continue;

      // Self closing tag.
      if (chunk.suffix === '/') continue;

      for (var x = i + 1; x < html.length; x++) {
        var _chunk = html[x];

        if (typeof _chunk !== 'object' || Array.isArray(chunk)) continue;

        // Doctype
        if (_chunk.prefix === '!') continue;

        // Self closing tag
        if (_chunk.suffix === '/') continue;

        // Make sure the tags match
        if (chunk.name !== _chunk.name) continue;

        // Increase depth by 2 if the closing tag isn't found.
        // This is so the depth tracks the open and close tag.
        if (_chunk.prefix !== '/') depth += 2;
        else depth--;

        // Reset depth to 0 if it somehow goes below 0.
        if (depth < 0) depth = 0;

        // Skip if depth is greater than 0
        if (depth > 0) continue;

        // Assign `.end` to the original tag, for mapping functions.
        chunk.end = {
          tag: _chunk,
          id: x
        };

        // If we make it this far, we've already got our tag.
        break;
      }
    }

    return html;
  };


  //
  // ### Parser(opts)
  // ### new Parser(opts)
  // #### @opts {Object} options to set when initializing the parser.
  //
  // Options does not have to be defined. In fact, it just passes options
  // to `this.configure` of the Parser instance.
  //
  var Parser = exports.Parser = function (opts) {
    if (!(this instanceof Parser)) return new Parser(opts);

    // Compile regex for self closing tags.
    this.regex('selfClosing', /^area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr$/i);

    // Compile regex for quotes.
    this.regex('quotes', [
      "'[^']*'",
      '"[^"]*"'
    ].join('|'));

    this.regex('allQuotes', this.regex('quotes'), 'g');

    // Compile regex for attributes
    this.regex('attribute', [

      // Valid name formats
      [
        '(',
          [
            '[\\-\\w]+'
          ].join('|'),
        ')',
      ].join(''),

      [
        '(?:',      // Don't remember this group.
        '=',        // ERMAGERD EQUAL SIGN
        '\\s*',

        // Valid attribute formats
        [
          '(',
            [
              this.regex('quotes').source,
              '[^\\s]*'
            ].join('|'),
          ')'
        ].join(''),

        ')?'        // End group and make it optional.
      ].join('')

    ].join('\\s*'), 'i');

    this.regex('allAttributes', this.regex('attribute'), 'ig');

    // Compile regex for DOCTYPE attributes.
    this.regex('doctypeAttributes', [
      this.regex('quotes').source,
      '[^\\s]+'
    ].join('|'), 'g');

    // Tag prefixes
    this.regex('prefixes', /([!\/]?)/);

    // Tag suffixes
    this.regex('suffixes', /([\/]?)/);

    // Compile regex for tags
    this.regex('tag', [
      '<',    // Start of tag

      this.regex('prefixes').source,

      // Valid tags
      [
        '(',
          [
            'doctype',
            '\\w+'
          ].join('|'),
        ')',
      ].join(''),

      // Anything between the tag name and suffixes or end tag.
      [
        '(',
          [
            this.regex('quotes').source,
            '[^\\/>]*'
          ].join('|'),
        ')'
      ].join(''),

      this.regex('suffixes').source,

      '>'     // End of tag
    ].join('\\s*'), 'i');

    this.regex('allTags', this.regex('tag'), 'ig');

    this.configure(opts);
  };

  //
  // Define hidden prototype methods that can't be overwritten.
  //
  Parser.prototype = global.define({
    _regex: {},

    configure: function (opts) {
      var self = this;

      if (typeof opts !== 'object' || Array.isArray(opts)) return;

      if (typeof opts.regex === 'object') {
        Object.keys(opts.regex).forEach(function (key) {
          if (opts.regex[key] instanceof RegExp)
            self.regex(key, opts.regex[key])

          else if (typeof opts.regex[key] === 'object' &&
                   !Array.isArray(opts.regex[key]) &&
                   (typeof opts.regex[key].regex === 'string' || 
                    opts.regex[key] instanceof RegExp)) {
            self.regex(key, options.regex[key].regex, options.regex[key].flags);
          }
        });
      }

      return this;
    },

    parse: function (html) {
      var buffer = html,
          tags = buffer.match(this.regex('allTags')),
          parsed = [],
          depth = 0,
          currentTag, lastTag;

      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i],
            next = tags[i+1];

        parsed.push(this.parseTag(tag));
        buffer = buffer.slice(tag.length);

        if (next) {
          parsed.push(buffer.slice(0, buffer.indexOf(next)));
          buffer = buffer.slice(buffer.indexOf(next));
        }
        else parsed.push(buffer);
      }

      return parsed;
    },

    parseAttributes: function (attrs) {
      var attrs = attrs.match(this.regex('allAttributes')) || [],
          parsed = {},
          self = this;

      attrs.forEach(function (attr, id) {
        var split = attr.match(self.regex('attribute')),
            name = split[1];

        parsed[split[1]] = {
          name: split[1],
          input: split[0],
          value: split[2] && self.trimQuotes(split[2]) || '',
        };

        parsed[name].toString = function () {
          return [
            this.name,
            this.value && [
              '=',
              '"',
              this.value,
              '"'
            ].join('') || ''
          ].join('');
        };
      });

      parsed.toString = function () {
        var self = this;

        return Object.keys(this).filter(function (key) {
          return typeof self[key] === 'object';
        }).map(function (key) {
          return self[key].toString();
        }).join(' ');
      };

      return parsed;
    },

    parseDoctypeAttributes: function (attrs) {
      var attrs = attrs.match(this.regex('doctypeAttributes')) || [],
          parsed = {},
          self = this;

      [ 'root', 'dtd', 'fpi', 'uri' ].forEach(function (key, id) {
        if (attrs[id]) parsed[key] = attrs[id];
      });

      parsed.toString = function () {
        return [
          this.root,
          this.dtd,
          this.fpi,
          this.uri
        ].join(' ');
      };

      return parsed;
    },

    parseTag: function (tag) {
      var tag = tag.match(this.regex('tag')),
          parsed = {};

      [ 'input', 'prefix', 'name', 'attributes', 'suffix' ].forEach(function (key, id) {
        parsed[key] = tag[id];
      });

      parsed.toString = function () {
        return [
          '<',
          this.prefix,
            [
              this.name,
              this.attributes.toString(),
            ].join(' ').trim(),
          this.suffix,
          '>'
        ].join('');
      };

      if (parsed.name.match(/^doctype$/i)) {
        return global.mixin(false, parsed, {
          attributes: this.parseDoctypeAttributes(parsed.attributes)
        });
      }

      return global.mixin(false, parsed, {
        attributes: this.parseAttributes(parsed.attributes)
      });
    },

    regex: function (key, regex, flags) {
      if (key && !regex) return this._regex[key];
      if (regex instanceof RegExp) {
        regex = regex.source;

        if (!flags) {
          flags = [
            {
              name: 'global',
              flag: 'g'
            },
            {
              name: 'ignoreCase',
              flag: 'i'
            },
            {
              name: 'multiline',
              flag: 'm'
            },
            {
              name: 'sticky',
              flag: 'y'
            }
          ].map(function (flag) {
            return regex[flag.name] && regex[flag.flag] || '';
          }).join('');
        }
      }
      this._regex[key] = new RegExp(regex, flags);
      return this._regex;
    },

    trimQuotes: function (text) {
      if (text && text.match(/^(?:'[^']*'|^"[^"]*")$/))
        text = text.replace(/^['"]/, '').replace(/['"]$/, '');
      return text;
    }
  });

})(Plates, this);
