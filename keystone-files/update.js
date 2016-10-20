//Dev Notes:
//req.user.get('id') returns the GUID of the user making the API request.
//req.params.id is the ID of the list item that is being manipulated. (should match above unless user is in superuser list)
//req.params.list = list being manipulated.
module.exports = function (req, res) {
  var keystone = req.keystone;

  debugger;

  //Validate the CSRF token
  if (!keystone.security.csrf.validate(req)) {
          return res.apiError(403, 'invalid csrf');
  }

  //Update the List Item
  req.list.model.findById(req.params.id, function (err, item) {

    //Handle database errors
    if (err) return res.status(500).json({ error: 'database error', detail: err });
    
    //Handle 'not found' errors
    if (!item) return res.status(404).json({ error: 'not found', id: req.params.id });
    
    //Update the List Item
    req.list.updateItem(item, req.body, { files: req.files, user: req.user }, function (err) {
      if (err) {
              var status = err.error === 'validation errors' ? 400 : 500;
              var error = err.error === 'database error' ? err.detail : err;
              return res.apiError(status, error);
      }
      // Reload the item from the database to prevent save hooks or other
      // application specific logic from messing with the values in the item
      req.list.model.findById(req.params.id, function (err, updatedItem) {
              res.json(req.list.getData(updatedItem));
      });
    });
    
  });
};
