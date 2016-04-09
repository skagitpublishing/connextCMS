var async = require('async'),
	keystone = require('keystone');

var Page = keystone.list('Page');

/**
 * List Pages
 */
exports.list = function(req, res) {
	Page.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			pages: items
		});
		
	});
}

/**
 * Get Page by ID
 */
exports.get = function(req, res) {
	Page.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			page: item
		});
		
	});
}


/**
 * Create a Page
 */
exports.create = function(req, res) {
	
	var item = new Page.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			page: item
		});
		
	});
}

/**
 * Get Page by ID
 */
exports.update = function(req, res) {
	Page.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				page: item
			});
			
		});
		
	});
}

/**
 * Delete Page by ID
 */
exports.remove = function(req, res) {
	Page.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				success: true
			});
		});
		
	});
}