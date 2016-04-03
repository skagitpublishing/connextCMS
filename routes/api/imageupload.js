var async = require('async'),
keystone = require('keystone');
var exec = require('child_process').exec;

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

        var item = new ImgData.model(),
		data = (req.method == 'POST') ? req.body : req.query;

        item.getUpdateHandler(req).process(req.files, function(err) {

                if (err) return res.apiError('error', err);

                res.apiResponse({
                        image_upload: item
                });

        });
}

/**
 * Delete Image by ID
 */
exports.remove = function(req, res) {
	var imageId = req.params.id;
	ImgData.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {

			if (err) return res.apiError('database error', err);
			
			//Delete the file
      			exec('rm public/uploads/images/'+imageId+'.*', function(err, stdout, stderr) { 
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

