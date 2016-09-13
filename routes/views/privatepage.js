var keystone = require('keystone');

exports = module.exports = function(req, res) {
	debugger;
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'privatepage';
	locals.filters = {
		privatepage: req.params.privatepage
	};
	locals.data = {
		privatepages: []
	};
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('PrivatePage').model.findOne({
			state: 'published',
			slug: locals.filters.privatepage
		}).populate('author sections');
		
		q.exec(function(err, result) {
			locals.data.privatepage = result;
			next(err);
		});
		
	});
	
	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('PrivatePage').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.privatepages = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('privatepage');
	
};
