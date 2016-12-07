/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'bootstrap-table',
  'text!../../../js/app/templates/frontEndWidget.html'
], function ($, _, Backbone, BootstrapTable, FrontEndWidgetTemplate) {
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
    
    //This function is called by render. It's purpose is to initialize and populate the bootstrap
    //table with data from the Front End Widgets Collection.
    populateTable: function() {
      //debugger;
      
      //Initialize the table.
      this.$el.find('#widgetTable').bootstrapTable({
        sortName: 'entry',
        sortOrder: 'desc',
        showExport: false,
        columns: [{
            field: 'entry',
            title: 'Entry',
            sortable: true
        }, {
            field: 'title',
            title: 'Title',
            sortable: true
        }, {
            field: 'desc',
            title: 'Description',
            sortable: true
        }
        ],
      });

      //Loop through the Keep Out coordinates.
      var tableData = [];
      for(var i=0; i < global.frontEndWidgetCollection.length; i++) {
        var item = global.frontEndWidgetCollection.models[i];
        var obj = new Object();

        obj.entry = i;
        obj.title = '<a href="#/" onclick="global.frontEndWidgetView.loadWidget('+i+')">'+item.get('title')+'</a>';
        obj.desc = item.get('desc');

        tableData.push(obj);
      }
      this.$el.find('#widgetTable').bootstrapTable('load', tableData);
      this.$el.find('.fixed-table-loading').hide();
      
    },
    
    loadWidget: function(index) {
      //debugger;
      
      var item = global.frontEndWidgetCollection.models[index];
      
      this.$el.find('#widgetEditor').slideDown(); //Show the widget editor
      this.$el.find('hr').slideDown(); //Show any hr separators
      
      this.$el.find('#widgetTitle').val(item.get('title'));
      this.$el.find('#widgetDesc').val(item.get('desc'));

      var htmlArray = item.get('htmlArray');
      var imgArray = item.get('imgUrl');
debugger;      
      //BEGIN POPULATION OF HTML ARRAY
      if((htmlArray.length == 0) || (htmlArray.length == undefined)) {
        //Do nothing. Leave the default HTML the way it is.
      } else {
        
        for(var i=0; i < htmlArray.length; i++) {
          var tmpEntry = this.$el.find('#widgetHTML').find('.scaffold').clone(); //Clone the scaffolding
        
          tmpEntry.removeClass('scaffold'); //Remove the scaffold class
          tmpEntry.find('button').click(this.deleteHtml(i)); //Assign a click handler to the delete button
          tmpEntry.find('textarea').val(htmlArray[i]); //Populate the text box
          this.$el.find('#widgetHTML').append(tmpEntry);
        }
        
        //Remove the scaffolding element
        this.$el.find('#widgetHTML').find('.scaffold').remove();
      }
      //END POPULATION OF HTML ARRAY
      
      //BEGIN POPULATION OF IMAGE ARRAY
      if((imgArray.length == 0) || (imgArray.length == undefined)) {
        //Do nothing. Leave the default image layout the way it is.
        debugger;
      } else {
        debugger;
      }
      //END POPULATION OF IMAGE ARRAY
    },
    
    //This function is called when the user clicks on the delete button assigned to an HTML array 
    //element. It's purpose is to remove the array entry from the model.
    deleteHtml: function(index) {
      debugger;
    }
    

	});

  //debugger;
	return FrontEndWidgetView;
});