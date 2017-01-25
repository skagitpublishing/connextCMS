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
      
      this.$el.html(this.template);

      this.populateView();
      
			return this;
		},
    
    //This function reads in the public and private JSON files and popultes the View with the data inside of them.
    populateView: function() {
      debugger;
      
      $.getJSON('/api/serversettings/getprivate', '', function(data) {
        debugger;
      });
      
      $.getJSON('/js/publicsettings.json', '', function(data) {
        debugger;
      };
    }
    

	});

  //debugger;
	return SiteSettingsView;
});
