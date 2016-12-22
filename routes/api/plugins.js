var async = require('async'),
	keystone = require('keystone');

var exec = require('child_process').exec;
var fs = require('fs');

//var security = keystone.security;

//var Page = keystone.list('Page');

/**
 * List Plugins
 */
exports.list = function(req, res) {
	
  //Check if the log file already exists.
  exec('ls public/plugins/', function(err, stdout, stderr) {

    if (err) {
      console.log('child process exited with error code ' + err.code);
      return;
    }

    console.log('stdout = ');
    console.log(stdout);
    
    
    //The file does not exist.
    if(1) {
  
    } else {
      /*
      //Read in the JSON file
      fs.readFile('private/userdata/'+userData+'/'+filename, function(err, data) {
        
        if(err) {
          console.log('Error: '+err.message);
          res.apiResponse({
            plugins: ['']
          });
        }

        //Error Handling
        if((data.length == 0) || (data == "")) {
          console.log('Listing is empty. Exiting.');
          return;
        }

        //Parse the JSON data
        var serverData = data.toString();
        serverData = JSON.parse(serverData);
      
        //Return the JSON data.
        res.apiResponse({
          success: true,
          data: serverData 
        });
        
      });
      */
    }
  });
      
/*      
  Page.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			pages: items
		});
		
	});
*/
}

/**
 * Get Page by ID
 */
/*
exports.get = function(req, res) {
	Page.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			page: item
		});
		
	});
}
*/
