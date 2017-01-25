/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/siteSettings.html'
], function ($, _, Backbone, SiteSettingsTemplate) {
	'use strict';

	var SiteSettingsView = Backbone.View.extend({

    /*
     * Dev Notes:
     * -It is assumed that the keyDisplay and keyNames array exist in both private and public JSON files.
     * -It is assumed that the keyDisplay and keyNames arrays are the same length.
     */
    
    
		tagName:  'div',
    
    el: '#siteSettingsView', 

		template: _.template(SiteSettingsTemplate),

		events: {
      //'hidden.bs.modal #fileLibraryModal': 'refreshView'
      '#saveSettingsBtn click': 'saveSettings'
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
      //debugger;
      log.push('siteSettingsView.js/populateView() called.');
      
      var thisView = this;
      
      $.getJSON('/api/serversettings/getprivate', '', function(data) {
        //debugger;
        log.push('Data successfully retrieved from /api/serversettings/getprivate');
        
        thisView.privateData = data.privateSettings;
        
        thisView.populatePrivateData();
      });
      
      $.getJSON('/js/publicsettings.json', '', function(data) {
        //debugger;
        log.push('Data successfully retrieved from publicsettings.json');
        
        thisView.publicData = data;
        
        thisView.populatePublicData();
      });
      
      
    },
    
    //This function populates the DOM with data stored inside the private settings file.
    //This function is called by populateView() after the data has been retrieved from the server.
    populatePrivateData: function() {
      //debugger;
      log.push('siteSettingsView.js/populatePrivateData() called.');
      
      for(var i=0; i < this.privateData.keyNames.length; i++) {
        
        //Clone the scaffolding element
        var thisForm = this.$el.find('#privateScaffold').clone();
        thisForm.prop('id', '');
        
        //Get the display name and display value from the JSON data.
        var displayName = this.privateData.keyDisplay[i];
        var displayVal = this.privateData[this.privateData.keyNames[i]]
        
        //Add the JSON data to the DOM.
        thisForm.find('label').text(displayName);
        thisForm.find('input').val(displayVal);
        
        //Append this new form element to the DOM.
        this.$el.find('#privateSettingsForm').append(thisForm);
      }
      
      //Hide the scaffolding element.
      this.$el.find('#privateScaffold').hide();
    },
    
    //This function populated the DOM with the data stored inside the public settings file.
    //This function is called by populateView() after the data has been retrieved.
    populatePublicData: function() {
      //debugger;
      log.push('siteSettingsView.js/populatePublicData() called.');
      
      for(var i=0; i < this.publicData.keyNames.length; i++) {
        
        //Clone the scaffolding element
        var thisForm = this.$el.find('#publicScaffold').clone();
        thisForm.prop('id', '');
        
        //Get the display name and display value from the JSON data.
        var displayName = this.publicData.keyDisplay[i];
        var displayVal = this.publicData[this.publicData.keyNames[i]]
        
        //Add the JSON data to the DOM.
        thisForm.find('label').text(displayName);
        thisForm.find('input').val(displayVal);
        
        //Append this new form element to the DOM.
        this.$el.find('#publicSettingsForm').append(thisForm);
      }
      
      //Hide the scaffolding element.
      this.$el.find('#publicScaffold').hide();
    },
    
    //This function is called when the user clicks on the Save Settings button.
    saveSettings: function(event) {
      debugger;
    }
    

	});

  //debugger;
	return SiteSettingsView;
});
