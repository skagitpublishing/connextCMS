var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Front End Widget Model
 * ==========
 * A front end width is simply an array of HTML and Image URLs that can retrieved and placed around the site.
 */

var FrontEndWidget = new keystone.List('FrontEndWidget', {
  map: { name: 'title' },
  //autokey: { path: 'slug', from: 'title', unique: true },
});

FrontEndWidget.add({
  title: { type: String, required: true },
  desc: { type: String },
  htmlArray: { type: Types.TextArray },
  imgUrl: { type: Types.TextArray }
});


FrontEndWidget.defaultColumns = 'title';
FrontEndWidget.register();
