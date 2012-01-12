
$(function() {

  var html = $('#template1').html();
  var data = { 
    "address": "http://github.com/hij1nx",
    "name": "Github"
  };

  var map = new Plates.Map();
  map.where('class').is('link').use('address').as('href');
  map.where('class').is('link').use('name');

  var output = Plates.bind(html, data, map);

  $('#ui').html(output);
  $('#ui').html();

});
