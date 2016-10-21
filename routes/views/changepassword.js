var keystone = require('keystone');

exports = module.exports = function(req, res) {

        var view = new keystone.View(req, res);
        var locals = res.locals;

        locals.user = req.user;
        locals.user.password = "";

        locals.superusers = keystone.get('superusers');
  
        // Set locals
        locals.section = 'changepassword';

        // Render the view
        view.render('changepassword', {layout: true});

};
