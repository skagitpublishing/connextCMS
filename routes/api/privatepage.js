var async = require('async'),
	keystone = require('keystone');

var security = keystone.security;

var PrivatePage = keystone.list('PrivatePage');

/**
 * List PrivatePages
 */
exports.list = function(req, res) {
  debugger;
  
  //Reject the API request if the user is not logged in.
  try {
    var userId = req.user.get('id');  
  } catch(err) {
    return res.apiError('not logged in', err);
  }
  
  
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
	
  //Reject the API request if the user is not logged in.
  try {
    var userId = req.user.get('id');  
  } catch(err) {
    return res.apiError('not logged in', err);
  }
  
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
  
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is a Keystone Admin
  //var isAdmin = req.user.get('isAdmin');
  //if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  //}
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  var admins = keystone.get('admins');
  var superusers = keystone.get('superusers');
  var userId = req.user.get('id');
  if((admins.indexOf(userId) == -1) && (superusers.indexOf(userId) == -1)) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin');
  }
	
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
  
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is a Keystone Admin
  //var isAdmin = req.user.get('isAdmin');
  //if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  //}
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  var admins = keystone.get('admins');
  var superusers = keystone.get('superusers');
  var userId = req.user.get('id');
  if((admins.indexOf(userId) == -1) && (superusers.indexOf(userId) == -1)) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin');
  }
  
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
  
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is a Keystone Admin
  //var isAdmin = req.user.get('isAdmin');
  //if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  //}
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  var admins = keystone.get('admins');
  var superusers = keystone.get('superusers');
  var userId = req.user.get('id');
  if((admins.indexOf(userId) == -1) && (superusers.indexOf(userId) == -1)) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin');
  }
  
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