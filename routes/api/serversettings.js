var async = require('async'),
        keystone = require('keystone');

//var exec = require('child_process').exec;
var fs = require('fs');
var Promise = require('mpromise');

//var security = keystone.security;

//var Page = keystone.list('Page');

var privateSettings = require('../../private/privatesettings.json');
var publicSettings = require('../../public/js/publicsettings.json');

//Have the server read the privatesettings.json file and return the data stored there.
exports.getprivate = function(req, res) {
  //debugger;
  
  //Ensure the user making the request is a Keystone Admin
  var isAdmin = req.user.get('isAdmin');
  if(!isAdmin) {
    return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  }

  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Superuser
  var suPromise = verifySuperUser(req, res);

  //Executes if the user is a verified superuser.
  suPromise.then(function(result) {
    //debugger;
    
    //Read in the privatesettings.json file.
    fs.readFile('private/privatesettings.json', 'utf8', function(err, data) {

      //Error Handling.
      if(err) {
        console.log('Error in /api/serversettings/getprivate while trying to read privatesettings.json file.');
        console.log(err);
        //response.send(false); //Send failure
        res.apiError('file error', err);

      } else {
        
        //Parse the JSON data into an object.
        privateSettings = JSON.parse(data); 

        //Send the data stored in the JSON file.
        res.apiResponse({
          privateSettings: privateSettings
        });
      }
    });
    
  //Rejects the API if the user is not a superuser.
  }, function(err) {
    console.log('/api/serversettings/getprivate exited with error '+err);
    console.log('User ID = '+req.user.get('id'));
  });
  
  
}

exports.saveprivate = function(req, res) {
  
  //Ensure the user making the request is a Keystone Admin
  var isAdmin = req.user.get('isAdmin');
  if(!isAdmin) {
    return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  }

  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Superuser
  var suPromise = verifySuperUser(req, res);

  //Executes if the user is a verified superuser.
  suPromise.then(function(result) {

    var data = req.query;

    //Write out the server_settings.json file.
    fs.writeFile('private/privatesettings.json', JSON.stringify(data, null, 4), function (err) {
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
    
    
  //Rejects the API if the user is not a superuser.
  }, function(err) {
    console.log('/api/serversettings/saveprivate exited with error '+err);
    console.log('User ID = '+req.user.get('id'));
  });
}



exports.savepublic = function(req, res) {
  //Ensure the user making the request is a Keystone Admin
  var isAdmin = req.user.get('isAdmin');
  if(!isAdmin) {
    return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  }

  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Superuser
  var suPromise = verifySuperUser(req, res);

  //Executes if the user is a verified superuser.
  suPromise.then(function(result) {

    var data = req.query;
    
    //Write out the server_settings.json file.
    fs.writeFile('public/js/publicsettings.json', JSON.stringify(data, null, 4), function (err) {
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
    
    
    //Update the list of superusers stored in memory
    if(typeof(data.superUsers) == "string") {
      keystone.set('superusers', [data.superUsers]);
    } else {
      keystone.set('superusers', data.superUsers);
    }
    
    console.log('superusers = '+keystone.get('superusers'));
    
    //Update the list of admins stored in memory
    if(typeof(data.adminUsers) == "string") {        
      keystone.set('admins', [data.adminUsers]);
    } else {        
      keystone.set('admins', data.adminUsers);        
    }
    
    console.log('admins = '+keystone.get('admins'));
    
    //Temporary code for debugging.
    var admins = keystone.get('admins');
    var superusers = keystone.get('superusers');
    console.log('admins = '+admins);
    console.log('superusers = '+superusers);
    
  //Rejects the API if the user is not a superuser.
  }, function(err) {
    console.log('/api/serversettings/saveprivate exited with error '+err);
    console.log('User ID = '+req.user.get('id'));
  });
}


//This function reads in the publicsettings.json file and returns the list of superusers as a csv separated string.
var verifySuperUser = function(req, res) {
  //debugger;
  var promise = new Promise;
  
  //Read in the publicsettings.json file.
  fs.readFile('public/js/publicsettings.json', 'utf8', function(err, data) {
    //debugger;
    
    //Error handling
    if(err) {
      console.log('Error in routes/api/serversetting.js/verifySuperUser() while trying to read publicsettings.json file.');
      console.log(err);
      
      res.apiError(404, err)
      promise.reject(404);
      
    } else {
      
      //Parse the JSON data into an object.
      try {
        publicSettings = JSON.parse(data); 
      } catch(err) {
        console.error('Problem trying to parse the public settings file: ',err);
      }
      
      //Handle different permutations of the superUsers array/string.
      if(typeof(publicSettings.superUsers) == "string") {
        var superusers = publicSettings.superUsers;
      } else {
        var superusers = publicSettings.superUsers.join();
      }
      
      //Get the userID for user making this API request.
      var userId = req.user.get('id');
      
      //Reject if user ID is not listed in the superusers list.
      if(superusers.indexOf(userId) == -1) {
        res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Superuser');
        promise.reject(403);
      //Resolve if the user ID *is* listed in the superusers list.
      } else {
        promise.resolve();        
      }
    }
  });
  
  return promise;
}