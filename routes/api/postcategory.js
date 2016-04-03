var async = require('async'),
	keystone = require('keystone');

var PostCategory = keystone.list('PostCategory');

/**
 * List PostCategory
 */
exports.list = function(req, res) {
	PostCategory.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			postcategory: items
		});
		
	});
}

/**
 * Get PostCategory by ID
 */
exports.get = function(req, res) {
	PostCategory.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			postcategory: item
		});
		
	});
}


/**
 * Create a Post
 */
exports.create = function(req, res) {
	
	var item = new PostCategory.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			postcategory: item
		});
		
	});
}

/**
 * Get PostCategory by ID
 */
exports.update = function(req, res) {
	PostCategory.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				postcategory: item
			});
			
		});
		
	});
}

/**
 * Delete PostCategory by ID
 */
exports.remove = function(req, res) {
	PostCategory.model.findById(req.params.id).exec(function (err, item) {
		
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