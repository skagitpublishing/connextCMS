/*global define*/
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
      this.loadedPlugins = []; //An array containing all the loaded plugins.
      this.pluginData = []; //An array containing the contents of the pluginSettings.json file.
		},

    render: function () {      
      //debugger;
      
      this.$el.html(this.template);
      
      $.get('/api/plugins/list', '', function(data) {
        debugger;
        
        //Error Handling
        if( (!data.success) || (data.plugins.length == 0) ) {
          return;
        }
        
        //Save the pluginSettings.json data
        global.pluginView.pluginData = data.plugins; //Copy the plugin data to the Plugin View
        var pluginData = data.plugins; //Also copy the plugin data to a local variable.
        
        //Add this plugin to the loadedPlugins array.
        var thisPlugin = new Object();
        thisPlugin.views = [];
        thisPlugin.models = [];
        global.pluginView.loadedPlugins.push(thisPlugin);

        //Get the index of this plugin and store in the pluginData, for refrence from within the plugin's own code.
        var pluginIndex = global.pluginView.loadedPlugins.length-1;
        global.pluginView.pluginData[pluginIndex].pluginIndex = pluginIndex;
        
        //Loop through each PLUGIN
        for(var i=0; i < pluginData.length; i++) {
          
          //Add a div to the DOM. This will be the div for the current plugin.
          global.pluginView.$el.find('#pluginParentDiv').append('<div id="plugin'+i+'" hidden></div>');
          
          //Tell the plugin which div belongs to it.
          global.pluginView.pluginData[i].divId = '#plugin'+i;

          //Execute the this plugins pluginLoader.js program.
          var thisPluginPath = '/plugins/'+pluginData[i].pluginDirName+'/pluginLoader.js';
          $.getScript(thisPluginPath, function(data, textStatus, jqxhr) {
            debugger;
          })
          .fail(function( jqxhr, settings, exception ) {
            debugger;
          });

        }
        
      });
      
			return this;
		},
    
    

	});

  //debugger;
	return PostsView;
});