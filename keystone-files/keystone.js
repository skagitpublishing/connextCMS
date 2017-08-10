// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');
var fs = require('fs');


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

  //'name': 'connextcms-temp',
  'name': 'keystone4',
  'brand': 'ConnextCMS',

  'less': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'hbs',
  'port': 3000,

  'custom engine': handlebars.create({
          layoutsDir: 'templates/views/layouts',
          partialsDir: 'templates/views/partials',
          defaultLayout: 'default',
          helpers: new require('./templates/views/helpers')(),
          extname: '.hbs'
  }).engine,

  'auto update': true,
  'session': true,
  'auth': true,
  'user model': 'User',
  'file limit': '50MB',
  'mongo': 'mongodb://172.17.0.1:3500/connextcms'
});

// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
        _: require('underscore'),
        env: keystone.get('env'),
        utils: keystone.utils,
        editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
        'posts': ['posts', 'post-categories'],
        'galleries': 'galleries',
        'enquiries': 'enquiries',
        'users': 'users'
});

//Add User GUIDs to the arrays below to make that user an Admin or Superuser.
//Only superusers can change other users passwords. They can also access the Keystone Admin UI.
//Admins can access the API and only the ConnextCMS Dashboard.
//keystone.set('superusers', ['57c88289144da4ea0dc979db']);
//keystone.set('admins', ['57c88289144da4ea0dc979db']);
//This function reads in the publicsettings.json file and sets the list of admins and superusers.
fs.readFile('public/js/publicsettings.json', 'utf8', function(err, data) {
  //debugger;

  if(err) {
    console.log('Error in keystone.js while trying to read publicsettings.json file.');
    console.log(err);
  } else {

    var publicSettings = JSON.parse(data);

    if(typeof(publicSettings.superUsers) == "string") {
      keystone.set('superusers', [publicSettings.superUsers]);
    } else {
      keystone.set('superusers', publicSettings.superUsers);
    }

    if(typeof(publicSettings.adminUsers) == "string") {
      keystone.set('admins', [publicSettings.adminUsers]);
    } else {
      keystone.set('admins', publicSettings.adminUsers);
    }

    // Start Keystone to connect to your database and initialise the web server
    // Need to be inside the readFile function handler.
    keystone.start();
  }
});

