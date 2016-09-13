var async = require('async'),
	keystone = require('keystone');

var PrivatePage = keystone.list('PrivatePage');

/**
 * List PrivatePages
 */
exports.list = function(req, res) {
	PrivatePage.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			pages: items
		});
		
	});
}

/**
 * Get PrivatePage by ID
 */
exports.get = function(req, res) {
	PrivatePage.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			page: item
		});
		
	});
}


/**
 * Create a PrivatePage
 */
exports.create = function(req, res) {
	
	var item = new PrivatePage.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			page: item
		});
		
	});
}

/**
 * Get PrivatePage by ID
 */
exports.update = function(req, res) {
	PrivatePage.model.findById(req.params.id).exec(function(err, item) {
		
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
 * Delete PrivatePage by ID
 */
exports.remove = function(req, res) {
	PrivatePage.model.findById(req.params.id).exec(function (err, item) {
		
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