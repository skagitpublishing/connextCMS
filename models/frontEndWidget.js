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
  //state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  //author: { type: Types.Relationship, ref: 'User', index: true },
  //publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
  //image: { type: Types.CloudinaryImage },
  //content: {
  //        brief: { type: Types.Html, wysiwyg: true, height: 150 },
  //        extended: { type: Types.Html, wysiwyg: true, height: 400 },
  //},
  //categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
  htmlArray: { type: Types.TextArray },
  imgUrl: { type: Types.TextArray }
});


FrontEndWidget.defaultColumns = 'title';
FrontEndWidget.register();
