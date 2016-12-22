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
        
        this.pluginData = data.plugins;
        
        //Loop through each PLUGIN
        for(var i=0; i < this.pluginData.length; i++) {
          
          //Add a div to the DOM. This will be the div for the current plugin.
          global.pluginView.$el.find('#pluginParentDiv').append('<div id="plugin'+i+'" hidden></div>');
          
          //Loop through each VIEW within the plugin
          for(var j=0; j < this.pluginData[i].backboneViews.length; j++) {
            
            //var thisViewPath = '/plugins/'+this.pluginData[i].pluginDirName+'/'+this.pluginData[i].backboneViews[j];
            
            var thisPluginPath = '/plugins'+this.pluginData[i].pluginDirName+'/pluginLoader.js';
            
            $.getScript(thisPluginPath, function(data, textStatus, jqxhr) {
              debugger;
            })
            .fail(function( jqxhr, settings, exception ) {
              debugger;
            });
          }
        }
        
      });
      
			return this;
		},
    
    

	});

  //debugger;
	return PostsView;
});