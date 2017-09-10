var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PrivatePage Model
 * ==========
 */

var PrivatePage = new keystone.List('PrivatePage', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

PrivatePage.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	sections: { type: Types.Relationship, ref: 'PageSection', many: true },
  priority: { type: Number },
  redirectUrl: { type: String },
  redirectNewWindow: { type: Boolean }
});

PrivatePage.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

PrivatePage.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
PrivatePage.register();
