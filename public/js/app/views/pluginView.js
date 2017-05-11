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
      //debugger;
      
      var thisView = this;
      
      this.$el.html(this.template);
      
      $.get('/api/plugins/list', '', function(data) {
        //debugger;
        
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
          var tmpObj = {};
          tmpObj.views = [];
          tmpObj.models = [];
          tmpObj.collections = [];
          thisView.loadedPlugins[i] = tmpObj;
          
          //Load the Backbone Views, Models, and Collections associated with this plugin.
          thisView.loadViews(i);
          
          thisView.loadModels(i);
        }
        
      });
      
			return this;
		},
    
    //This function instantiates the Backbone Views, Models, and Collections associated with a plugin.
    //It expects the plugin metadata to be passed into it. This is the data stored in the pluginSettings.json
    loadViews: function(pluginIndex) {
      //debugger;
      
      //Get local handles to view-level objects.
      var thisView = this;                                //Get a handle on this View.
      var thisPluginData = this.pluginData[pluginIndex];  //Plugin Metadata
      var thisPlugin = this.loadedPlugins[pluginIndex];   //Will hold the plugins Backbone constructs.
      
      // ---BEGIN BACKBONE VIEWS---

      //Loop through each of the backbone views for this plugin.
      //Have to use an async for loop since we making async calls to $.getScript().
      global.async.eachOf(thisPluginData.backboneViewFiles, function(value, key, callback) {
        //debugger;
        
        try {
    
          var pluginDir = '/plugins/'+thisPluginData.pluginDirName+'/';
          
          //Load the individual views for this plugin. Generate a promise for each view.
          var scriptPromise = $.getScript(pluginDir+value, function(data, textStatus, jqxhr) {
            //debugger;

          })
          .fail(function( jqxhr, settings, exception ) {
            debugger;

            console.error('Problem with pluginView.js/loadViews() when trying load Backbone Views: '+exception);
          });

          //When the promise resolves:
          scriptPromise.then(function(results) {
            //debugger;

            //Scope is lost at the point and a handle needs to be established on the current plugin.
            var thisPluginIndex = global.pluginView.getPluginIndex('backboneViewNames', results);
            if(thisPluginIndex == null) {
              console.error('Could not find plugin.');
              return;
            } else {
              var thisPluginData = global.pluginView.pluginData[thisPluginIndex];
              var thisPlugin = global.pluginView.loadedPlugins[thisPluginIndex];
            }

            //Create the new view.
            var constructor = "new "+thisPluginData.backboneViewNames[key]+"({el: $(thisPluginData.divId), pluginData: thisPluginData, pluginHandle: thisPlugin })";
            var thisView = eval(constructor);

            //Add this view to the loadedPlugins.views[] array.
            thisPlugin.views.push(thisView);

            //Create a global reference to the primary view that should be loaded when the user
            //clicks on the left menu entry for this plugin.
            if(thisPluginData.primaryViewConstructor == thisPluginData.backboneViewNames[key]) {

              var pluginViewReference = "global.pluginView."+thisPluginData.primaryViewInstance;
              var evalStr = pluginViewReference+" = thisPlugin.views["+key+"]";
              eval(evalStr);

              //Add a menu item for this primary view.
              var tmpLi = '<li id="'+thisPluginData.primaryViewId+'"><a href="#/" onclick="'+pluginViewReference+'.render()"><i class="fa '+thisPluginData.primaryViewFAIcon+'"></i> <span>'+thisPluginData.primaryViewLabel+'</span></a></li>';
              var pluginLi = global.leftMenuView.$el.find('#plugin-link');
              pluginLi.parent().append(tmpLi);
            }

            //debugger;
            //loadModels();
            //callback();

          }, function(error) {
            debugger;
            callback(error);
          });

        } catch(err) {
          callback(err);
        }
        
      }, function(err) {
        debugger;

        if(err) {
          debugger;
          console.error('Problem with pluginView.js/loadViews() when trying to load Backbone Views: '+err);  
        } else {
          debugger;
          
          //Views have been loaded. Next, load the models.
          //global.pluginView.loadModels();
        }

      });
      // ---END BACKBONE VIEWS---
      
      
    },
    
    
    // ---BEGIN BACKBONE MODELS---

    //This function is called in parallel with loadViews(). It's purpose is to load the
    //Backbone models associated with this plugin.
    loadModels: function(pluginIndex) {
      debugger;
      
      //Get local handles to view-level objects.
      var thisView = this;                                //Get a handle on this View.
      var thisPluginData = this.pluginData[pluginIndex];  //Plugin Metadata
      var thisPlugin = this.loadedPlugins[pluginIndex];   //Will hold the plugins Backbone constructs.
      
      //Loop through each of the backbone views for this plugin.
      //Have to use an async for loop since we making async calls to $.getScript().
      global.async.eachOf(thisPluginData.backboneModelFiles, function(value, key, callback) {
        try {
          
          var pluginDir = '/plugins/'+thisPluginData.pluginDirName+'/';
          
          //Load the individual views for this plugin. Generate a promise for each view.
          var scriptPromise = $.getScript(pluginDir+value, function(data, textStatus, jqxhr) {
            
          })
          .fail(function( jqxhr, settings, exception ) {
            debugger;

            console.error('Problem with pluginView.js/loadModels() when trying load Backbone Models: '+exception);
            callback(exception);
          });

          //When the promise resolves:
          scriptPromise.then(function(results) {
            debugger;

            //Scope is lost at the point and a handle needs to be established on the current plugin.
            var thisPluginIndex = global.pluginView.getPluginIndex('backboneViewNames', results);
            if(thisPluginIndex == null) {
              console.error('Could not find plugin.');
              return;
            } else {
              var thisPluginData = global.pluginView.pluginData[thisPluginIndex];
              var thisPlugin = global.pluginView.loadedPlugins[thisPluginIndex];
            }
            
            var constructor = "new "+thisPluginData.modelNames[key]+"(null,{pluginData: thisPluginData, pluginHandle: thisPlugin })";
            var thisModel = eval(constructor);

            thisPlugin.models.push(thisModel);
            
          }, function(err) {
            debugger;
            callback(err);
          });
          
        } catch(err) {
          callback(err);
        }
        
      }, function(err) {
        debugger;

        if(err) {
          debugger;
          console.error('Problem with pluginView.js/loadModels() when trying to load Backbone Models: '+err);  
        } else {
          debugger;
          
          //Views have been loaded. Next, load the models.
          //global.pluginView.loadModels();
        }

      });
    },

    // ---END BACKBONE MODELS---
    
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
    //global.pluginView.pluginData that we're trying to deal with. It returns
    //the element inside the global.pluginView.pluginData array that matches the
    //key and script. If no match is found, it returns null.
    //This function is used to regain scope on the currently targeted plugin.
    //
    //Since this function uses text matching, it can cause a false positive when
    //text in the Backbone files are copied from the template. If this because
    //a serious issue, I might want to think of ways to refine this function.
    getPluginIndex: function(key, script) {
      //debugger;

      try {
        var thisPluginIndex = null;
        
        //Loop through each plugin's metadata.
        for(var i=0; i < global.pluginView.pluginData.length; i++) {
          
          //Loop through each element in the key field.
          var keyArray = eval('global.pluginView.pluginData[i].'+key);
          
          for(var j=0; j < keyArray.length; j++) {
            if(script.indexOf(keyArray[j]) > -1) {
              console.log('pluginView.js/getPluginIndex() found a match with '+keyArray[j]);
              thisPluginIndex = i;
              return thisPluginIndex;
            }  
          }
        }

        if(thisPluginIndex == null) {
          debugger;
          console.error('Problem in pluginView.js/getPluginIndex(). Could not identify the view and could not find the plugin index. key = '+key+' script = '+script);
          return null;
        }

      } catch(err) {
        debugger;
        console.log('Error in getPluginIndex(): '+err);
        return null;
      }
    }

    // ---END UTILITY FUNCTIONS---

	});

  //debugger;
	return PostsView;
});