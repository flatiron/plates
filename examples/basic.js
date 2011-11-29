var Plates = require('../lib/plates');

var html = '<div id="test">Old Value</div>';
var data = { "test": "New Value" };

var output = Plates.bind(html, data);

console.log(output);