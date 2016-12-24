var keystone = require('keystone');
var middleware = require('./middleware');

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

debugger;

module.exports = function(app) {
  debugger;

  app.get('/api/exampleplugin/list', keystone.middleware.api, routes.api.exampleplugin.list);
  app.all('/api/exampleplugin/create', keystone.middleware.api, routes.api.exampleplugin.create);
  
}