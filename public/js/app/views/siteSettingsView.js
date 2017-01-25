/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/siteSettings.html'
], function ($, _, Backbone, SiteSettingsTemplate) {
	'use strict';

	var SiteSettingsView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#siteSettingsView', 

		template: _.template(SiteSettingsTemplate),

		events: {
      //'hidden.bs.modal #fileLibraryModal': 'refreshView'
		},

		initialize: function () {
			this.privateData = new Object();
      this.publicData = new Object();
		},

    render: function () {
      //debugger;
      log.push('siteSettingsView.js/render() called.');
      
      this.$el.html(this.template);

      this.populateView();
      
			return this;
		},
    
    //This function reads in the public and private JSON files and popultes the View with the data inside of them.
    //This function is called by render().
    populateView: function() {
      debugger;
      log.push('siteSettingsView.js/populateView() called.');
      
      var thisView = this;
      
      $.getJSON('/api/serversettings/getprivate', '', function(data) {
        debugger;
        log.push('Data successfully retrieved from /api/serversettings/getprivate');
        
        thisView.privateData = data.privateSettings;
        
        thisView.populatePrivateData();
      });
      
      $.getJSON('/js/publicsettings.json', '', function(data) {
        debugger;
        log.push('Data successfully retrieved from publicsettings.json');
        
        thisView.publicData = data;
        
        thisView.populatePublicData();
      });
      
      
    },
    
    //This function populates the DOM with data stored inside the private settings file.
    //This function is called by populateView() after the data has been retrieved from the server.
    populatePrivateData: function() {
      debugger;
      log.push('siteSettingsView.js/populatePrivateData() called.');
    },
    
    //This function populated the DOM with the data stored inside the public settings file.
    //This function is called by populateView() after the data has been retrieved.
    populatePublicData: function() {
      debugger;
      log.push('siteSettingsView.js/populatePublicData() called.');
    }
    

	});

  //debugger;
	return SiteSettingsView;
});
