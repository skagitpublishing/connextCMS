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
      res.apiResponse({
		    success: false,
        plugins: []
		  });
      return;
    }

    console.log('stdout = ');
    console.log(stdout);
    
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
        
        res.apiResponse({
          success: true,
          plugins: allPluginData
        });
      }
      
    });
    
  
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
