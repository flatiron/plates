

 // map.where(<attribute>).is(<value>).use(<data-key>).as(<attribute>);


 var html = '111<div id="outer">222<div id="inner">333</div><img class="test" src=""/>444</div>555';

 !function() {
   var data = { "foo": "New Value" };
   var map = Plates.Map();

   map.where('class').is('test').use('foo').as('src');
   map.where('id').is('inner').use('foo');

   console.log(Plates.bind(html, data, map));
 }();



 // Able to match an `id` with the value of `foo`, but could not find a data
 // key with with the name `fodo`. Should fail to populate, shouldn't affect 
 // the inner values of the match.


 !function() {

   var data = { "foo": "New Value" };
   var map = Plates.Map();

   map.where("id").is('foo').use("fodo");
   console.log(Plates.bind(html, data, map));
 }();




 // Able to match an `id` with the value of `foo` as well as find a data
 // key with the value `foo`. Should replace all inner content of the tag.


 !function() {
   var data = { "foo": "New Value" };
   var map = Plates.Map();

   map.where("id").is('inner').use("foo");
   console.log(Plates.bind(html, data, map));
 }();


 // without using a map, there should be a match between
 // the data-keys and the IDs in the HTML fragment.
      

 !function() {
   var data = { "outer": "New Value" };
   console.log(Plates.bind(html, data));  
 }();

      