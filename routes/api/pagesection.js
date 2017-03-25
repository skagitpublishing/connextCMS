var async = require('async'),
	keystone = require('keystone');

var security = keystone.security;

var fs = require('fs');
var Promise = require('mpromise');

var PageSection = keystone.list('PageSection');

/*
 * Dev Note 1/27/17 CT:
 * -This API includes an alternate way to implement the ConnextCMS admin and super user permissions.
 * -This method is overly complicated and was given up in favor of the simpler method used in the other APIs.
 * -The code is left here for posterity, in case I ever need to access it again.
 */

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
  //This is a check to make sure the user is a ConnexstCMS admin
  var adminPromise = verifyAdmin(req, res);

  //Executes if the user is a verified admin.
  adminPromise.then(function(result) {
  
    var item = new PageSection.model(),
      data = (req.method == 'POST') ? req.body : req.query;

    item.getUpdateHandler(req).process(data, function(err) {

      if (err) return res.apiError('error', err);

      res.apiResponse({
        pagesection: item
      });

    });
    
  //Rejects the API request if the user is not an admin.
  }, function(err) {
    console.log('/api/pagesection/create exited with error '+err);
    console.log('User ID = '+req.user.get('id'));
  });
}

/**
 * Get PageSection by ID
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
  //This is a check to make sure the user is a ConnexstCMS admin
  var adminPromise = verifyAdmin(req, res);

  //Executes if the user is a verified admin.
  adminPromise.then(function(result) {
  
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
    
  //Rejects the API request if the user is not an admin.
  }, function(err) {
    console.log('/api/pagesection/update exited with error '+err);
    console.log('User ID = '+req.user.get('id'));
  });
}

/**
 * Delete PageSection by ID
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
  //This is a check to make sure the user is a ConnexstCMS admin
  var adminPromise = verifyAdmin(req, res);

  //Executes if the user is a verified admin.
  adminPromise.then(function(result) {
  
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
    
  //Rejects the API request if the user is not an admin.
  }, function(err) {
    console.log('/api/pagesection/remove exited with error '+err);
    console.log('User ID = '+req.user.get('id'));
  });
}



//This function reads in the publicsettings.json file and returns the list of admin user IDs as a csv separated string.
var verifyAdmin = function(req, res) {
  debugger;
  var promise = new Promise;
  
  //Read in the publicsettings.json file.
  fs.readFile('public/js/publicsettings.json', 'utf8', function(err, data) {
    debugger;
    
    //Error handling
    if(err) {
      console.log('Error in routes/api/pagesection.js/verifyAdmin() while trying to read publicsettings.json file.');
      console.log(err);
      
      res.apiError(404, err)
      promise.reject(404);
      
    } else {
      
      //Parse the JSON data into an object.
      publicSettings = JSON.parse(data); 
      
      //Handle different permutations of the superUsers array/string.
      if(typeof(publicSettings.superUsers) == "string") {
        var superusers = publicSettings.superUsers;
      } else {
        var superusers = publicSettings.superUsers.join();
      }
      
      //Handle different permutations of the adminUsers array/string.
      if(typeof(publicSettings.adminUsers) == "string") {        
        var adminUsers = publicSettings.adminUsers;
      } else {        
        var adminUsers = publicSettings.adminUsers.join();        
      }
      
      //Combine the two lists, since superusers should also have admin permissions.
      adminUsers = superusers+','+adminUsers;
      
      //Get the userID for user making this API request.
      var userId = req.user.get('id');
      
      //Reject if user ID is not listed in the superusers list.
      if(adminUsers.indexOf(userId) == -1) {
        res.apiError(403, 'Not allowed to access this API. Not ConnextCMS admin.');
        promise.reject(403);
      //Resolve if the user ID *is* listed in the superusers list.
      } else {
        promise.resolve();        
      }
    }
  });
  
  return promise;
}