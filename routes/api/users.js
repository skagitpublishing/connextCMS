var async = require('async'),
	keystone = require('keystone');

var User = keystone.list('User');
var security = keystone.security;

//var superusers = keystone.get('superusers');
var Superusers = require('./superusers.js');
var superusersData = new Superusers.Constructor();
var superusers = superusersData.superusers;

debugger;

/**
 * List User
 */
exports.list = function(req, res) {
	User.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
    debugger;
    //Eventually add code here to blank out the password hash.
    
		res.apiResponse({
			user: items
		});
		
	});
}

/**
 * Get User by ID
 */
exports.get = function(req, res) {
	User.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			user: item
		});
		
	});
}


/**
 * Create a User
 */
/*
exports.create = function(req, res) {
	
	var item = new User.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			user: item
		});
		
	});
}
*/

/**
 * Get User by ID
 */

exports.update = function(req, res) {
  debugger;
  
  //var superusers = ['57c88289144da4ea0dc979db'];
  
  
  
  //var keystonereq = req.keystone;
	if (!security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
  
  debugger;
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.superusers = keystone.get('superusers');
  
  var userId = req.user.get('id');
  if(userId != req.params.id) {
    if(superusers.indexOf(userId) == -1) {
      return res.apiError(403, 'Not allowed to change this user settings.');
    }
  }
  
	User.model.findById(req.params.id).exec(function(err, item) {
		debugger;
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				user: item
			});
			
		});
		
	});
}


/**
 * Delete User by ID
 */
/*
exports.remove = function(req, res) {
	User.model.findById(req.params.id).exec(function (err, item) {
		
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
*/