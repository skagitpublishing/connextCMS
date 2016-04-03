var async = require('async'),
keystone = require('keystone');

var ImgData = keystone.list('FrontendWidget');

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

