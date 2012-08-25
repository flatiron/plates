![plates](https://github.com/flatiron/plates/raw/master/plates.png)

# Synopsis
Plates (short for templates) binds data to markup. Plates has NO special syntax. It works in the browser and in [Node.js](http://nodejs.org/).

# Motivation
- DSLs (Domain Specific Languages) such as <%=foo%> or {{foo}} reduce portability.
- DOM templating is SLOW.
- Promote the separation of concerns principle by decoupling decision making from presentation.
- Make both the code and markup more readable and maintainable by a wider audience.

# Status

[![Build Status](https://secure.travis-ci.org/flatiron/plates.png)](http://travis-ci.org/flatiron/plates)

# Features
- Automatically bind data to a tag's body by matching unique tag IDs to data keys.
- Bind data to a tag's body based on any attribute's values.
- Bind data to a tag's attribute based on any attribute's values.

- TODO: Specify option to create attribute if it does not exist.

# Installation
There are a few ways to use `plates`. Install the library using npm. You can add
it to your `package.json` file as a dependancy, or include the script in your
HTML page.

# Usage

## Simple case
By default, `plates` will try to match the key in the data to an `id` in the
tag, since both should be unique.

```js
var Plates = require('plates');

var html = '<div id="test">Old Value</div>';
var data = { "test": "New Value" };

var output = Plates.bind(html, data); 
```

## Explicit instructions
A common use case is to apply the new value to each tag's body based on the
`class` attribute.

```js
var html = '<span class="name">User</span>...<span class="name">User</span>';

var data = { "username": "John Smith" };
var map = Plates.Map();

map.class('name').to('username');

console.log(Plates.bind(html, data, map));
```

## Complex instructions
Another common case is to replace the value of an attribute if it is a match.

```js
var html = '<a href="/"></a>';

var data = { "newurl": "http://www.nodejitsu.com" };
var map = Plates.Map();

map.where('href').is('/').insert('newurl');

console.log(Plates.bind(html, data, map));
```

Partial value replacement

```js
var html = '<a href="/foo/bar"></a>';

var data = { "newurl": "bazz" };
var map = Plates.Map();

map.where('href').has(/bar/).insert('newurl'); // `has` can take a regular expression.

console.log(Plates.bind(html, data, map));
```

In even more complex cases, an arbitrary attribute can be specified. If a value
is matched, a specific value can be used and then used as another attribute's
value.

```js
var html = '<img data-foo="bar" src=""></img>';

var data = { "imageurl": "http://www.nodejitsu.com" };
var map = Plates.Map();

map.where('data-foo').is('bar').use('imageurl').as('src');

console.log(Plates.bind(html, data, map));
```

## Collections

Plates can also iterate through collections:

```js
var html = '<div class="name"></div>';
var collection = [
  {'name': 'Louis CK'},
  {'name': 'Andy Kindler'},
  {'name': 'Greg Giraldo'}
];

console.log(Plates.bind(html, collection));
```

## Partials

Plates also supports partials:

```js
var partial = '<li class="partial"></li>';
var base = '<div><h1 class="foo"></h1><ul class="menu"></ul></div>';

var baseData = { foo: 'bar' };
var mapping = Plates.Map();

mapping.class('menu').append(partial);
console.log(Plates.bind(base, baseData, mapping));
```

# API

## Plates Static Methods

```
function Plates.bind(html, data, map)
@param html {String} A string of well-formed HTML.
@param data {Object} A JSON object.
@param map {Object} An instance of `Plates.Map()`.

@return {String} The result of merging the data and html.
```

## Map Constructor

```
function Plates.Map(options)
@options {Object} An object literal that contains configuration options.
  - @option where {String} The default attribute to match on instead of ID.
  - @option as {String} The default attribute to replace into.
@return {Object} An object that represents a reusable map, has mapping methods.
```

## Map Instance Methods

### where()

```
function Map#where(attribute)
@param attribute {String} An attribute that may be found in a tag.

This method will initiate a clause. Once a clause has been established,
other member methods may be chained to each other in any order.
```

### class(), className()

```
function Map#class(attribute)
@param attribute {String} A value that may be found in the `class` attribute of a tag.
```

### is()

```
function Map#is(value)
@param value {String} The value of the attribute specified in the `where` clause.
```

### has()

```
function Map#has(value)
@param value {String|RegExp} The value of the attribute specified in the `where` clause.
```

### insert()

```
function Map#insert(attribute)
@param attribute {String} A string that represents a key. Data will be inserted into 
the attribute that was specified in the `where` clause.
```

### use()

```
function Map#use(key)
@param key {String|Function} A string that represents a key in the data object that was provided or a function which returns a string value to use.

If a function is provided, it will be passed data, value and tagbody parameters.
```

### to()

```
function Map#to(key)
@param key {String|Function} A string that represents a key in the data object that was provided or a function which returns a string value to use.

If a function is provided, it will be passed data, value and tagbody parameters.

Same as `use` method.
```

### as()

```
function Map#as(attribute)
@param attribute {String} A string that represents an attribute in the tag.

If there is no attribute by that name found, one may be created depending on the options
that were passed to the `Map` constructor.
```

### remove()

```
function Map#remove()

Removes the matching elements from the template.
```

### append(), partial()

```
function Map#append(html, data, map)
@param html {String} A string that represents the new template that needs to be
added.
@param data {Mixed} data for the partial, if it's a string it's a reference to a
key in the data structure that was supplied to the main template.
@param map {Plates.Map} data mapping for the partial.

If the supplied HTML string doesn't contain any HTML markup we assume that we
the given string is the location of the template. When you are using Plates on
the browser is assumes that you supplied it with an id selector and will fetch
the innerHTML from the element. If you are using Plates in Node.js it assumes
that you gave it a file path that is relative to the current working directory.
```

# License

(The MIT License)

Copyright (c) 2011 Nodejitsu Inc. http://www.twitter.com/nodejitsu

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
