
## Synopsys

Plates (short for templates) binds data to markup. There's NO special syntax. It works in the browser and in node.js!

## Motivation

- No NON-HTML in your HTML such as <%=foo%> or {{foo}}.
- Promote portable code/markup by decoupling decision making from presentation.
- Make both the code and markup more readable and maintainable.
- Allow designers to write markup and test styling without impacting logic or special placeholders.

## Usage

On the Server

```js

  var Plate = require('plates');
  var plate = new Plate;

  var html = '<div id="test">Old Value</div>';
  var data = { "test": "New Value" };

  var output = plate(html, data).html(); 

  //
  // with the output, you could serve it up or process it further with JSDOM
  //

  response.end(output);

```     

On the client

```js

  <script>
  
    var plate = new Plate;

    var html = '<div id="test">Old Value</div>';
    var data = { "test": "New Value" };

    var output = plate(html, data).html();

    //
    // with the output, append it to the current document or use it however you want.
    //
    document.body.appendAdjacentHTML(output); // append this to the DOM using native DOM APIs.

    // or... use some jQuery

    $('body').appendChild(output);
  
  </script>
  
```

## License