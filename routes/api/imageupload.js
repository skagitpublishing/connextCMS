var async = require('async'),
keystone = require('keystone');
var exec = require('child_process').exec;

var security = keystone.security;

var ImgData = keystone.list('ImageUpload');

/**
 * List Images
 */
exports.list = function(req, res) {
        ImgData.model.find(function(err, items) {

                if (err) return res.apiError('database error', err);

                res.apiResponse({
                        collections: items
                });

        });
}

/**
 * Get Image by ID
 */
exports.get = function(req, res) {

        ImgData.model.findById(req.params.id).exec(function(err, item) {

                if (err) return res.apiError('database error', err);
                if (!item) return res.apiError('not found');

                res.apiResponse({
                        collection: item
                });

        });
}


/**
 * Update Image by ID
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
  
  ImgData.model.findById(req.params.id).exec(function(err, item) {

    if (err) return res.apiError('database error', err);
    if (!item) return res.apiError('not found');

    var data = (req.method == 'POST') ? req.body : req.query;

    item.getUpdateHandler(req).process(data, function(err) {

      if (err) return res.apiError('create error', err);

      res.apiResponse({
              collection: item
      });

    });

  });
}

/**
 * Upload a New Image
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
  
  var item = new ImgData.model(),
    data = (req.method == 'POST') ? req.body : req.query;

  item.getUpdateHandler(req).process(req.files, function(err) {

    if (err) return res.apiError('error', err);

    debugger;
    
    console.log('item.url = '+item.url);
    
    //Copy the file to the local public directory
    exec('cp ~/public'+item.url+' ~/myCMS/public/uploads/images/', function(err, stdout, stderr) { 
      if (err) { 
        console.log('child process exited with error code ' + err.code);
        console.log('Warning: Could not copy image to local public directory. Issue with routes/api/imageupload.js/create().')
        return; 
      } 
      console.log(stdout); 
    });
    
    res.apiResponse({
            image_upload: item
    });

  });
}

/**
 * Delete Image by ID
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
  
	var imageId = req.params.id;
	ImgData.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {

			if (err) return res.apiError('database error', err);
			
      console.log('Deleting image file: '+item.url);
      
      //Delete the file
      //exec('rm public/uploads/images/'+imageId+'.*', function(err, stdout, stderr) { 
      exec('rm ../public'+item.url, function(err, stdout, stderr) { 
        if (err) { 
          console.log('child process exited with error code ' + err.code);
          console.log('Warning: Could not delete image from hard drive. Issue with routes/api/imageupload.js/remove().')
          return; 
        } 
        console.log(stdout); 
      });

			return res.apiResponse({
				success: true
			});
		});
		
	});
}

