var async = require('async'),
	keystone = require('keystone');

//var exec = require('child_process').exec;
var fs = require('fs');

//var security = keystone.security;

//var Page = keystone.list('Page');

var privateSettings = require('../../private/privatesettings.json');
var publicSettings = require('../../public/js/publicsettings.json');


exports.getprivate = function(req, res) {
  
  //Ensure the user making the request is a Keystone Admin
  //var isAdmin = req.user.get('isAdmin');
  //if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  //}
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  //var admins = keystone.get('admins');
  //var userId = req.user.get('id');
  //if(admins.indexOf(userId) == -1) {
  //  return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  //}
  
  fs.readFile('../../private/privatesettings.json', 'utf8', function(err, data) {
    /*
    if(err) {
      console.log('Error in /api/serversettings/getprivate while trying to read privatesettings.json file.');
      console.log(err);
      //response.send(false); //Send failure
      res.apiError('file error', err);
      
    } else {
      privateSettings = JSON.parse(data); 
      
      res.apiResponse({
        privateSettings: privateSettings
      });
    }
    */
  });
  
  
}

exports.saveprivate = function(req, res) {
  //Ensure the user making the request is a Keystone Admin
  //var isAdmin = req.user.get('isAdmin');
  //if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  //}
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  //var admins = keystone.get('admins');
  //var userId = req.user.get('id');
  //if(admins.indexOf(userId) == -1) {
  //  return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  //}
  
  var data = req.query;
  
  //Write out the server_settings.json file.
  fs.writeFile('../../private/privatesettings.json', JSON.stringify(data, null, 4), function (err) {
    if(err) {
      console.log('Error in /api/serversettings/save while trying to write serversettings.json file.');
      console.log(err);
      //response.send(false); //Send failure
      res.apiError('file error', err);
      
    } else {
      console.log('/api/serversettings/save executed. privatesettings.json updated.');
      //response.send(true); //Send acknowledgement that setting were saved successfully.
      res.apiResponse({
        success: true,
      });
    }
  });
}



exports.savepublic = function(req, res) {
  //Ensure the user making the request is a Keystone Admin
  //var isAdmin = req.user.get('isAdmin');
  //if(!isAdmin) {
  //  return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  //}
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  //var admins = keystone.get('admins');
  //var userId = req.user.get('id');
  //if(admins.indexOf(userId) == -1) {
  //  return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  //}
  
  var data = req.query;
  
  //Write out the server_settings.json file.
  fs.writeFile('../../public/js/publicsettings.json', JSON.stringify(data, null, 4), function (err) {
    if(err) {
      console.log('Error in /api/serversettings/savepublic while trying to write serversettings.json file.');
      console.log(err);
      //response.send(false); //Send failure
      res.apiError('file error', err);
      
    } else {
      console.log('/api/serversettings/savepublic executed. publicsettings.json updated.');
      //response.send(true); //Send acknowledgement that setting were saved successfully.
      res.apiResponse({
        success: true,
      });
    }
  });
}
