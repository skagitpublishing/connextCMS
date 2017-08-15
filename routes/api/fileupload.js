var async = require('async'),
keystone = require('keystone');
var exec = require('child_process').exec;

var security = keystone.security;

var FileData = keystone.list('FileUpload');

/**
 * List Files
 */
exports.list = function(req, res) {
        FileData.model.find(function(err, items) {

                if (err) return res.apiError('database error', err);

                res.apiResponse({
                        collections: items
                });

        });
}

/**
 * Get File by ID
 */
exports.get = function(req, res) {

        FileData.model.findById(req.params.id).exec(function(err, item) {

                if (err) return res.apiError('database error', err);
                if (!item) return res.apiError('not found');

                res.apiResponse({
                        collection: item
                });

        });
}


/**
 * Update File by ID
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
  
  FileData.model.findById(req.params.id).exec(function(err, item) {

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
 * Upload a New File
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
  
  var item = new FileData.model(),
		data = (req.method == 'POST') ? req.body : req.query;

  item.getUpdateHandler(req).process(req.files, function(err) {

    if (err) return res.apiError('error', err);

    res.apiResponse({
            file_upload: item
    });

  });
}

/**
 * Delete File by ID
 * Note: This will only delete the database entry. The file will still exist on the drive of the server.
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
  
	var fileId = req.params.id;
	FileData.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {

			if (err) return res.apiError('database error', err);
			
      debugger;
      
      var filePath = item.get('url');
      
			//Delete the file
      exec('rm public'+filePath, function(err, stdout, stderr) { 
        if (err) { 
          console.log('child process exited with error code ' + err.code); 
          console.log('Warning: Could not delete file from hard drive. Issue with routes/api/fileupload.js.')
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

