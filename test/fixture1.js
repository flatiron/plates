var Plates = require('../lib/plates');

//
// construct an instance
//
var plate = new Plates;

//
// construct an instance with the html and data as params.
//

// var plate = new Plates(html, data);

//
// set the html for an instance.
//
plate.html('<div id="foo"></div><div class="foo"><span id="test"></span></div>');

//
// get the html for an instance.
//
plate.html(); // `<div id="foo"></div><div class="foo"></div>`

//
// set the data for an instance.
//
plate.data({ "foo": "bar" });

//
// get the data for an instance.
//
plate.data(); // `{ "foo": "bar" }`

//
// bind the html and data for an instance.
// 
console.log(plate.bind()); // `<div id="foo">bar</div><div class="foo"></div>`

//
// bind the html and data with explicit instructions detailing
// the relationships between individual keys and the attribute
// they should use.
//
// plate.bind({ "foo": "class" }); // `<div id="foo"></div><div class="foo">bar</div>`

//
// 
//