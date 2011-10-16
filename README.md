
## Synopsys

Plates (short for templates) binds data to markup. There's NO special syntax. It works in the browser and in node.js!

## Motivation

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

Create an instance of the constructor, provide it html and data. Do something interesting with the new markup.

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

### On the client

Include the script somehow wherever you are going to use it.

```html
  <script type="text/javascript" src="plates.js"></script>
```

Create an instance of the constructor, provide it html and data. Append the new markup to the document.

```html

  <script type="text/javascript">
  
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