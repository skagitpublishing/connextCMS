/*ConnextCMS pluginView.js - This file loads plugins at run-time.*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/pluginTemplate.html'
], function ($, _, Backbone, PluginTemplate) {
	'use strict';

	var PostsView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#pluginDiv',  

		template: _.template(PluginTemplate),

		// The DOM events specific to an item.
		events: {

		},

		initialize: function () {
      this.loadedPlugins = []; //An array containing all the loaded plugins and their Backbone constructs.
      this.pluginData = []; //An array containing the contents of the pluginSettings.json file (the metadata) for each plugin.
		},

    render: function () {      
      debugger;
      
      var thisView = this;
      
      this.$el.html(this.template);
      
      $.get('/api/plugins/list', '', function(data) {
        debugger;
        
        //Error Handling
        if( (!data.success) || (data.plugins.length == 0) ) {
          return;
        }
        
        //Save the pluginSettings.json data
        thisView.pluginData = data.plugins; //Copy the plugin data (for all plugins) to the Plugin View
        var pluginData = data.plugins;      //Also copy the plugin data to a local variable.
        
        //Loop through each PLUGIN
        for(var i=0; i < pluginData.length; i++) {
          
          //Add a div to the DOM. This will be the div for the current plugin.
          thisView.$el.find('#pluginParentDiv').append('<div id="plugin'+i+'"></div>');
          
          //Tell the plugin which div belongs to it.
          thisView.pluginData[i].divId = '#plugin'+i;

          //Prep the loadedPlugins object for this plugin with an empty object.
          thisView.loadedPlugins[i] = {};
          
          //Load the Backbone Views, Models, and Collections associated with this plugin.
          thisView.loadConstructs(i);
          
          /*
          //Execute the this plugins pluginLoader.js program.
          var thisPluginPath = '/plugins/'+pluginData[i].pluginDirName+'/pluginLoader.js';
          $.getScript(thisPluginPath, function(data, textStatus, jqxhr) {
            debugger;
          })
          .fail(function( jqxhr, settings, exception ) {
            debugger;
          });
          */

        }
        
      });
      
			return this;
		},
    
    //This function instantiates the Backbone Views, Models, and Collections associated with a plugin.
    //It expects the plugin metadata to be passed into it. This is the data stored in the pluginSettings.json
    loadConstructs: function(pluginIndex) {
      debugger;
      
      //Get local handles to view-level objects.
      var thisView = this;                                //Get a handle on this View.
      var thisPluginData = this.pluginData[pluginIndex];  //Plugin Metadata
      var thisPlugin = this.loadedPlugins[pluginIndex];   //Will hold the plugins Backbone constructs.
      
      // ---BEGIN BACKBONE VIEWS---

      //Loop through each of the backbone views for this plugin.
      //Have to use an async for loop since we making async calls to $.getScript().
      global.async.eachOf(thisPluginData.backboneViewFiles, function(value, key, callback) {
        debugger;
        
        try {
    
          var pluginDir = '/plugins/'+thisPluginData.pluginDirName+'/';
          
          //Load the individual views for this plugin. Generate a promise for each view.
          var scriptPromise = $.getScript(pluginDir+value, function(data, textStatus, jqxhr) {
            debugger;

          })
          .fail(function( jqxhr, settings, exception ) {
            debugger;

            console.error('Problem with pluginView.js/loadConstructs() when trying load Backbone Views: '+exception);
          });

          //When the promise resolves:
          scriptPromise.then(function(results) {
            debugger;

            //Scope is lost at the point and a handle needs to be established on the current plugin.
            var thisPluginIndex = global.pluginView.getPluginIndex('backboneViewNames', results);
            if(!thisPluginIndex) {
              console.error('Could not find plugin.');
              return;
            }
            debugger;

            //Create the new view.
            var constructor = "new "+thisPlugin.backboneViewNames[key]+"({el: $(thisPluginData.divId), pluginData: thisPluginData, pluginHandle: thisPlugin })";
            var thisView = eval(constructor);

            //Add this view to the loadedPlugins.views[] array.
            //thisPlugin.views.push(thisPlugin.exampleView1);
            thisPlugin.views.push(thisView);

            //Create a global reference to the primary view that should be loaded when the user
            //clicks on the left menu entry for this plugin.
            //global.pluginView.exampleView1 = thisPlugin.exampleView1;
            debugger;
            /*
            if(global.pluginView.pluginData[key].primaryViewConstructor == thisPlugin.viewNames[key]) {
              pluginViewReference = "global.pluginView."+global.pluginView.pluginData[0].primaryViewInstance;
              var evalStr = pluginViewReference+" = thisView";
              eval(evalStr);

              //Add a menu item for this primary view.
              var tmpLi = '<li id="'+pluginData.primaryViewId+'"><a href="#/" onclick="'+pluginViewReference+'.render()"><i class="fa '+pluginData.primaryViewFAIcon+'"></i> <span>'+pluginData.primaryViewLabel+'</span></a></li>';
              pluginLi.parent().append(tmpLi);
            }
            */

            //loadModels();
            callback();

          }, function(error) {
            debugger;
            callback(error);
          });

        } catch(err) {
          callback(err);
        }
        
      }, function(err) {
        //debugger;

        if(err) {
          debugger;
          console.error('Problem with pluginView.js/loadConstructs() when trying to load Backbone Views: '+err);  
        } else {
          debugger;
          //loadModels();
        }

      });
      // ---END BACKBONE VIEWS---
      
      
    },
    
    // ---BEGIN UTILITY FUNCTIONS---

    
    //Dev note: I don't think this function is used any more.
    //This function returns a pointer to the global.pluginView.loadedPlugins[] element
    //that matches the directory name stored in that plugins metadata. It's useful for
    //getting the plugin constructs in a function without any scope.
    //If the loaded plugin can not be found, then this functioin returns false.
    getHandle: function(dirName) {
      try {
        debugger;

        for(var i=0; i < global.pluginView.pluginData.length; i++) {
          if(dirName == global.pluginView.pluginData[i].pluginDirName) {
            return global.pluginView.loadedPlugins[i];
          }
        }
        
        return false;
             
      } catch(err) {
          console.error('Problem in pluginView.js/getHandle(): '+err);
      }
    },
    

    //This function is used to retrieve the plugin index -e.g. which plugin inside
    //global.pluginView.loadedPlugins that we're trying to deal with. It returns
    //the element inside the global.pluginView.pluginData array that matches the
    //key and script. If no match is found, it returns false.
    getPluginIndex: function(key, script) {
      debugger;

      try {
        var thisPluginIndex = false;
        /*
        for(var i=0; i < global.pluginView.loadedPlugins.length; i++) {
          for(var j=0; j < global.pluginView.loadedPlugins[i].viewNames.length; j++) {
            if(script.indexOf(global.pluginView.loadedPlugins[i].viewNames[j]) > -1) {
              thisPluginIndex = global.pluginView.loadedPlugins[i];
              return thisPluginIndex;
            }  
          }
        }
        */
        
        
        
        for(var i=0; i < global.pluginView.pluginData.length; i++) {
          
          var keyArray = eval('global.pluginView.pluginData[i]'+key);
          
          for(var j=0; j < keyArray.length; j++) {
            if(script.indexOf(keyArray[j]) > -1) {
              thisPluginIndex = i;
              return thisPluginIndex;
            }  
          }
        }

        if(thisPluginIndex == undefined) {
          debugger;
          console.error('Problem in pluginView.js/getPluginIndex(). Could not identify the view and could not find the plugin index. key = '+key+' script = '+script);
          return false;
        }

      } catch(err) {
        debugger;
        console.log('Error in getPluginIndex(): '+err);
        return false;
      }
    }

    // ---END UTILITY FUNCTIONS---

	});

  //debugger;
	return PostsView;
});