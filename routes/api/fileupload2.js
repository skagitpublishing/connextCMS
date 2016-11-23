var async = require('async'),
keystone = require('keystone');
var exec = require('child_process').exec;
var flow = require('./flow-node.js')('tmp');

var security = keystone.security;

var FileData2 = keystone.list('FileUpload2');

/**
 * List Files
 */
exports.list = function(req, res) {
        FileData2.model.find(function(err, items) {

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

  /*
        FileData2.model.findById(req.params.id).exec(function(err, item) {

                if (err) return res.apiError('database error', err);
                if (!item) return res.apiError('not found');

                res.apiResponse({
                        collection: item
                });

        });
  */
  flow.get(req, function(status, filename, original_filename, identifier) {
    console.log('GET', status);

    if (status == 'found') {
      status = 200;
    } else {
      status = 204;
    }

    res.status(status).send();
  });
}


/**
 * Update File by ID
 */
exports.update = function(req, res) {
  
  //Ensure the user has a valid CSRF token
	if (!security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
  
  //Ensure the user making the request is a Keystone Admin
  var isAdmin = req.user.get('isAdmin');
  if(!isAdmin) {
    return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  }
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
  
  FileData2.model.findById(req.params.id).exec(function(err, item) {

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
//exports.create = function(req, res) {
exports.post = function(req, res) {
/*
  //Ensure the user has a valid CSRF token
	if (!security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
  
  //Ensure the user making the request is a Keystone Admin
  var isAdmin = req.user.get('isAdmin');
  if(!isAdmin) {
    return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  }
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
*/  
  var item = new FileData2.model(),
		data = (req.method == 'POST') ? req.body : req.query;

  /*
  item.getUpdateHandler(req).process(req.files, function(err) {

    if (err) return res.apiError('error', err);

    res.apiResponse({
            file_upload: item
    });

  });
  */
  
  flow.post(req, function(status, filename, original_filename, identifier) {
    console.log('POST', status, original_filename, identifier);

    res.status(status).send();
  });
}

/**
 * Delete File by ID
 * Note: This will only delete the database entry. The file will still exist on the drive of the server.
 */
exports.remove = function(req, res) {
  
  //Ensure the user has a valid CSRF token
	if (!security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
  
  //Ensure the user making the request is a Keystone Admin
  var isAdmin = req.user.get('isAdmin');
  if(!isAdmin) {
    return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  }
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
  
	var fileId = req.params.id;
	FileData2.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {

			if (err) return res.apiError('database error', err);
			
			//Delete the file
      exec('rm public/uploads/files/'+fileId+'.*', function(err, stdout, stderr) { 
        if (err) { 
            console.log('child process exited with error code ' + err.code); 
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

