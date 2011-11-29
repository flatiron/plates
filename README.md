# Plates [![Build Status](https://secure.travis-ci.org/flatiron/plates.png)](http://travis-ci.org/flatiron/plates)

## Synopsys

Plates (short for templates) binds data to markup. There's NO special syntax. It works in the browser and in node.js! The right way to do this is with a DOM. Unfortunately, at the moment, the DOM is slow. On the server, it is quite slow. So Plates implements a very loose HTML parser.

## Motivation

- 2x faster than Mustache.
- No NON-HTML in your HTML such as <%=foo%> or {{foo}}.
- Promote portable code/markup by decoupling decision making from presentation.
- Make both the code and markup more readable and maintainable.
- Allow designers to write markup and test styling without impacting logic or special placeholders.

## Usage

### On the Server

Install the library using npm or add it to your `package.json` file as a dependancy.

```bash
  $npm install plates
```

Take some markup, some data, bind them, done.

```js

  var Plates = require('plates');

  var html = '<div id="test">Old Value</div>';
  var data = { "test": "New Value" };

  var output = Plates.bind(html, data); 

  //
  // with the output, you could serve it up or process it further with JSDOM
  //

  ...
  response.end(output);
  ...

```     

### On the client

Include the script somehow wherever you are going to use it.

```html
  <script type="text/javascript" src="plates.js"></script>
```

Here's a contrived example using jQuery.

```html

<html>
  <head>
    <script type="text/javascript">

      var html = $('#template1')[0];
      var data = { "template1": "New Value" };

      var output = Plates.bind(html, data);

      $('#template1').html(output);
      $('#ui')

    </script>
    <style>
      .templates { display: none; }
    </style>
  <body>

    <div class="templates">
      <div id="template1">Old Value</div>
    </div>

    <div class="ui">
    </div>
  </body>
</html>

```

### Defining explicit instructions for matching data keys with html tags.

Plates will attempt to match the data key to the `id` of the element. If you want to be specific about the relationship between

#### An example of matching a data key to a class

```js

  var html = '<div id="test" class="sample example">Old Value</div>';
  var data = { "sample": "New Value" };

  //
  // A property map establishes the preferred mapping of data-key to tag property.
  //
  var options = { "sample": "class" };
  var output = Plates.bind(html, data, options);

```

#### An example of putting the new value into the attribute rather than the tag body.

```js

  var html = '<span></span><img id="bar" class="foo bazz" src=""/>';
  var data = { "bazz": "Hello, World" };

  var options = { "bazz": ["class", "src"] };

  var output = Plates.bind(html, data, options);

```

The options object contains a mapping of option-key to data-key. In the above example, the option-key has an array value. The array can contain two values, the attribute name (1) and optionally the attribute name (2) to populate with the new value.

## License

(The MIT License)

Copyright (c) 2011 Nodejitsu Inc. http://www.twitter.com/nodejitsu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. FUCK YEAH.
