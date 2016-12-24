/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

var exec = require('child_process').exec;
var fs = require('fs');
var async = require('async');
//var Promise = require('node-promise'); //Promises to handle asynchonous callbacks.
var Promise = require('mpromise');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
  app.get('/page/:page', routes.views.page); 
  app.get('/privatepage/:privatepage', middleware.requireUser, routes.views.privatepage);
	
  //Posts
  app.get('/api/post/list', keystone.middleware.api, routes.api.posts.list);
	app.all('/api/post/create', keystone.middleware.api, routes.api.posts.create);
	app.get('/api/post/:id', keystone.middleware.api, routes.api.posts.get);
	app.all('/api/post/:id/update', keystone.middleware.api, routes.api.posts.update);
	app.get('/api/post/:id/remove', keystone.middleware.api, routes.api.posts.remove);
  
  //Post Categories
  app.get('/api/postcategory/list', keystone.middleware.api, routes.api.postcategory.list);
	app.all('/api/postcategory/create', keystone.middleware.api, routes.api.postcategory.create);
	app.get('/api/postcategory/:id', keystone.middleware.api, routes.api.postcategory.get);
	app.all('/api/postcategory/:id/update', keystone.middleware.api, routes.api.postcategory.update);
	app.get('/api/postcategory/:id/remove', keystone.middleware.api, routes.api.postcategory.remove);

  //Pages
  app.get('/api/page/list', keystone.middleware.api, routes.api.page.list);
	app.all('/api/page/create', keystone.middleware.api, routes.api.page.create);
	app.get('/api/page/:id', keystone.middleware.api, routes.api.page.get);
	app.all('/api/page/:id/update', keystone.middleware.api, routes.api.page.update);
	app.get('/api/page/:id/remove', keystone.middleware.api, routes.api.page.remove);
  
  //Page Sections
  app.get('/api/pagesection/list', keystone.middleware.api, routes.api.pagesection.list);
	app.all('/api/pagesection/create', keystone.middleware.api, routes.api.pagesection.create);
	app.get('/api/pagesection/:id', keystone.middleware.api, routes.api.pagesection.get);
	app.all('/api/pagesection/:id/update', keystone.middleware.api, routes.api.pagesection.update);
	app.get('/api/pagesection/:id/remove', keystone.middleware.api, routes.api.pagesection.remove);

  //Image Upload Route
  app.get('/api/imageupload/list', keystone.middleware.api, routes.api.imageupload.list);
  app.get('/api/imageupload/:id', keystone.middleware.api, routes.api.imageupload.get);
  app.all('/api/imageupload/:id/update', keystone.middleware.api, routes.api.imageupload.update);
  app.all('/api/imageupload/create', keystone.middleware.api, routes.api.imageupload.create);
  app.get('/api/imageupload/:id/remove', keystone.middleware.api, routes.api.imageupload.remove);
  
  //File Upload Route
  app.get('/api/fileupload/list', keystone.middleware.api, routes.api.fileupload.list);
  app.get('/api/fileupload/:id', keystone.middleware.api, routes.api.fileupload.get);
  app.all('/api/fileupload/:id/update', keystone.middleware.api, routes.api.fileupload.update);
  app.all('/api/fileupload/create', keystone.middleware.api, routes.api.fileupload.create);
  app.get('/api/fileupload/:id/remove', keystone.middleware.api, routes.api.fileupload.remove);
  
  //Private Pages
  app.get('/api/privatepage/list', keystone.middleware.api, routes.api.privatepage.list);
	app.all('/api/privatepage/create', keystone.middleware.api, routes.api.privatepage.create);
	app.get('/api/privatepage/:id', keystone.middleware.api, routes.api.privatepage.get);
	app.all('/api/privatepage/:id/update', keystone.middleware.api, routes.api.privatepage.update);
	app.get('/api/privatepage/:id/remove', keystone.middleware.api, routes.api.privatepage.remove);
  
  //Users API
  app.get('/api/users/list', keystone.middleware.api, routes.api.users.list);
  app.get('/api/users/:id', keystone.middleware.api, routes.api.users.get);
  app.all('/api/users/:id/update', keystone.middleware.api, routes.api.users.update);
  //app.all('/api/users/create', keystone.middleware.api, routes.api.users.create);
  //app.get('/api/users/:id/remove', keystone.middleware.api, routes.api.users.remove);
  
  //Front End Widgets
  app.get('/api/frontendwidget/list', keystone.middleware.api, routes.api.frontendwidget.list);
	app.all('/api/frontendwidget/create', keystone.middleware.api, routes.api.frontendwidget.create);
	app.get('/api/frontendwidget/:id', keystone.middleware.api, routes.api.frontendwidget.get);
	app.all('/api/frontendwidget/:id/update', keystone.middleware.api, routes.api.frontendwidget.update);
	app.get('/api/frontendwidget/:id/remove', keystone.middleware.api, routes.api.frontendwidget.remove);
  
  //Plugins
  app.get('/api/plugins/list', keystone.middleware.api, routes.api.plugins.list);
  
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
  app.get('/dashboard', middleware.requireUser, routes.views.dashboard);
  app.get('/edituser', middleware.requireUser, routes.views.edituser);

  
  debugger;
  fs.readdirSync(__dirname).forEach(function(file) {
    debugger;
    var fileExt = file.slice(-3); //Get the file extension
    
    //If the file is .js file
    if( fileExt == ".js" ) {
      //Skip the index and middleware files
      if( (file == "index.js") || (file == "middleware.js") ) {
        return;
      //Any other .js files are assumed to be plugin router files.
      } else {
        debugger;
        var name = file.substr(0, file.indexOf('.'));
        require('./' + name)(app); 
      }  
    
    } else {
      return;
    }      
  });
  
};

//This function reads in a the pluginData.json files and adds any routes if finds to this application.
function getPluginAPIs() {
  debugger;
  
  var promise = new Promise;
  
  //Retrieve a listing of all plugins directories in the plugin folder.
  exec('ls public/plugins/', function(err, stdout, stderr) {

    if (err) {
      console.log('child process exited with error code ' + err.code);
      //return app;
      promise.reject(err);
    }

    //console.log('stdout = ');
    //console.log(stdout);
    
    //Convert stdout to an array of file names
    var blah = stdout.replace(/\n/g, ','); //Replace all new line characters with commas.
    var fileList = blah.split(','); //Separate the CSV string into an array.
    
    var allPluginData = [];
    
    //debugger;
    //Loop through each file in the directory.
    async.forEachOf(fileList, function(value, key, callback) {
      //debugger;
      
      //Skip blank lines.
      if(value == "") return callback();
      
      //Read in the file.
      fs.readFile('public/plugins/'+value+'/pluginSettings.json', function(err, data) {

        if(err) {
          //debugger;
          console.log('error trying to read plugin settings file for '+value);
          console.error(err.message);
        }
        
        try {
          debugger;
          //Convert the JSON data in the log file to an object.
          var pluginSettings = data.toString()
          pluginSettings = JSON.parse(pluginSettings);

          allPluginData.push(pluginSettings);
          
        } catch(err) {
          console.error('Problem trying to convert plugin '+value+' pluginSettings.js file to JSON.');
          console.error('Error: '+err.message);
          console.error('Skipping plugin '+value);
        }
        
        callback();
      });
      
    //This function runs when the loop is complete, or if it errors out.
    }, function(err) {
      debugger;
      
      if(err) {
        console.error('Error processing file '+value);
        console.error('Error: '+err.message);
      } else {
        console.log('all plugins successfully read in finished.');
        
        //res.apiResponse({
        //  success: true,
        //  plugins: allPluginData
        //});
        
        /*
        //Loop through each plugins
        for(var i=0; i < allPluginData.length; i++) {
          //Loop through each route listed in the pluginSettings.json file.
          for(var j=0; j < allPluginData[i].routes.length; j++) {
            
            var thisRoute = allPluginData[i].routes[j];
            
            var type = thisRoute.type;
            var path = thisRoute.path;
            var middleware = eval(thisRoute.middleware);
            var APIfunction = eval(thisRoute.APIfunction);
            
            var blah1 = keystone.middleware.api;
            var blah2 = routes.api.exampleplugin.create;
            
            //Add the routes to the app object
            if(thisRoute.type == "get") {
              app.get(path, middleware, APIfunction);
            } else if(thisRoute.type == "all") {
              app.all(path, middleware, APIfunction);
            }
          }
        }
        */
        
        //app.get('/api/exampleplugin/list', keystone.middleware.api, routes.api.exampleplugin.list);
        //app.all('/api/exampleplugin/create', keystone.middleware.api, routes.api.exampleplugin.create);
        
        //promise.resolve(allPluginData);
        promise.fulfill(allPluginData);
      }
      
      //return app;
      
    });
    
  
  });
  
  return promise;
}
