/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/frontEndWidget.html'
], function ($, _, Backbone, FrontEndWidgetTemplate) {
	'use strict';

	var FrontEndWidgetView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#frontEndWidgetView',  

		template: _.template(FrontEndWidgetTemplate),

		// The DOM events specific to an item.
		events: {

		},

		initialize: function () {

		},

    render: function () {      
      //debugger;
      
      this.$el.html(this.template);

      this.populateTable();
      
			return this;
		},
    
    populateTable: function() {
      //debugger;
      
      
      
    },
    
    
    

	});

  //debugger;
	return FrontEndWidgetView;
});