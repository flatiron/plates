
![](http://flatironjs.org/img/flatiron.png)

# Plates 
The anti-templating tool for every javascript environment.

## Synopsys

Plates (short for templates) binds data to markup. Plates has NO special syntax. It works in the browser and in `Node.js`.

## Motivation

- DOM templating is SLOW.
- DSLs (Domain Specific Languages) such as <%=foo%> or {{foo}} reduce portability.
- Promote the separation of concerns principle by decoupling decision making from presentation.
- Make both the code and markup more readable and maintainable by a wider audience.

## Status

[![Build Status](https://secure.travis-ci.org/flatiron/plates.png)](http://travis-ci.org/flatiron/plates)

## Features

- Automatically bind data to a tag's body by matching unique tag IDs to data keys.
- Bind data to a tag's body based on any attribute's values.
- Bind data to a tag's attribute based on any attribute's values.

- TODO: Specify option to create attribute if it does not exist.

## Installation
There are a few ways to use `plates`. Install the library using npm. You can add it to your `package.json` file as a dependancy, or include the script in your HTML page.

## Usage

```js

  var Plates = require('plates');

  var html = '<div id="test">Old Value</div>';
  var data = { "test": "New Value" };

  var output = Plates.bind(html, data); 

```

### Matching a data key to a class
Consider the case where you want to apply a values to each tag that has a class.

```js
  var html = '<span class="name">User</span>...<span class="name">User</span>';

  var data = { "username": "John Smith" };
  var map = Plates.Map();

  map.where('class').is('name').use('username');

  console.log(Plates.bind(html, data, map));
```

### Matching a data key to a class and inserting the new value into an attribute

```js
  var html = '<a href="/"></a>';

  var data = { "newurl": "http://www.nodejitsu.com" };
  var map = Plates.Map();

  map.where('href').is('/').use('newurl').as('href');

  console.log(Plates.bind(html, data, map));
```

## API

### Static Methods

```
  function Plates.bind(html, data, map)
  @param html {String} A string of well formed HTML.
  @param data {Object} A JSON object.
  @param map {Object} an instance of `Plates.Map()`.

  @return {String} the result of merging the data and html.
```

### Constructors

```
  function Plates.Map(options)
  @options {Object} an object literal that contains configuration options.
  @return {Object} an object that represents a reusable map, has mapping methods.
```

### Member Methods

```
  function Map#where(attribute)
  @param attribute {String} an attribute that may be found in a tag

  This method will initiate a `clause`. Once a clause has been established,
  other member methods may be chained to eachother in any order.
```

```
  function Map#is(value)
  @param value {String} the value of the attribute specified in the `where` clause.
```

```
  function Map#use(key)
  @param key {String} a string that represents a key in the data object that was provided.
```

```
  function Map#as(attribute)
  @param attribute {String} a string that represents an attribute in the tag.

  If there is no attribute by that name found, one may be created depending on the options
  that were passed to the Map constructor.
```

## License

(The MIT License)

Copyright (c) 2011 Nodejitsu Inc. http://www.twitter.com/nodejitsu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
