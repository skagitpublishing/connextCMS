var async = require('async'),
	keystone = require('keystone');

var PageSection = keystone.list('PageSection');

/**
 * List PageSection
 */
exports.list = function(req, res) {
	PageSection.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			pagesection: items
		});
		
	});
}

/**
 * Get PageSection by ID
 */
exports.get = function(req, res) {
	PageSection.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			pagesection: item
		});
		
	});
}


/**
 * Create a PageSection
 */
exports.create = function(req, res) {
	
	var item = new PageSection.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			pagesection: item
		});
		
	});
}

/**
 * Get PageSection by ID
 */
exports.update = function(req, res) {
	PageSection.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				pagesection: item
			});
			
		});
		
	});
}

/**
 * Delete PageSection by ID
 */
exports.remove = function(req, res) {
	PageSection.model.findById(req.params.id).exec(function (err, item) {
		
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