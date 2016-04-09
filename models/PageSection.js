var keystone = require('keystone');

/**
 * PageSection Model
 * ==================
 */

var PageSection = new keystone.List('PageSection', {
	autokey: { from: 'name', path: 'key', unique: true }
});

PageSection.add({
	name: { type: String, required: true },
  priority: { type: Number }
});

PageSection.relationship({ ref: 'Page', path: 'sections' });

PageSection.register();
