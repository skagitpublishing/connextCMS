var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'page';
	locals.filters = {
		page: req.params.page
	};
	locals.data = {
		pages: []
	};
	
	// Load the current post
	view.on('init', function(next) {
		
		var q = keystone.list('Page').model.findOne({
			state: 'published',
			slug: locals.filters.page
		}).populate('author sections');
		
		q.exec(function(err, result) {
			locals.data.page = result;
			next(err);
		});
		
	});
	
	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('Page').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');
		
		q.exec(function(err, results) {
			locals.data.pages = results;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('page');
	
};
